import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { MqttService, Topics } from '@services/mqtt.service';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import {
    fareConsole,
    updateFareConsole,
    cmBusIdInformation,
    updateCommissionBusIdInformation,
} from '@store/main/main.reducer';
import { IFareConsole, IBusID, MsgID, MsgSubID, ResponseStatus } from '@models';

import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';

@Component({
    selector: 'fare-console-setting',
    standalone: true,
    imports: [CommonModule, TranslateModule, MatSelectModule, NgScrollbarModule, CustomKeyboardComponent],
    templateUrl: './fare-console-setting.component.html',
    styleUrl: './fare-console-setting.component.scss',
})
export class FareConsoleSettingComponent implements OnDestroy, OnInit {
    private destroy$ = new Subject<void>();
    MsgID = MsgID;
    ResponseStatus = ResponseStatus;

    fareConsole$: Observable<IFareConsole>;
    fareConsoleSetting: IFareConsole = {
        deckType: {
            id: 0,
            label: '',
        },
        blsStatus: 0,
        busId: '',
        date: '',
        time: '',
        complimentaryDays: 0,
        message: '',
    };

    settingType: string = '';
    hasSubmitError: boolean = false;
    topics;

    selectedDeckTypeId: number = 0;

    blsStep = 1;
    selectedBlsStatus: number = 0;
    hasInputError = false;

    //bus id
    isShowKeyboard: boolean = false;
    private busIdInformation$: Observable<IBusID>;
    busIdTemp: string = '';
    busIdData: IBusID = {
        busId: '',
        operator: {
            id: 0,
            label: '',
            serviceProvider: 0,
        },
        operators: [],
    };
    busIdStep: number = 1;
    busIdPrefix: string = '';
    busIdNumber: string = '';
    hasBusIdNumberError: boolean = false;
    operatorIdTemp: number | null = null;
    busIdPrefixList = ['SBS', 'SMB', 'SG', 'PC'];

    constructor(
        private router: Router,
        private mqttService: MqttService,
        @Inject(DOCUMENT) private _document: Document,
        private store: Store<AppState>,
    ) {
        this.fareConsole$ = this.store.select(fareConsole);
        this.busIdInformation$ = this.store.select(cmBusIdInformation);
    }

    ngOnInit() {
        this._handleOnDocumentClick();

        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });

        this.fareConsole$.pipe(takeUntil(this.destroy$)).subscribe((data: IFareConsole) => {
            this.fareConsoleSetting = data;
            this.selectedDeckTypeId = data?.deckType?.id || 0;

            console.log('fareConsoleSetting', this.fareConsoleSetting);
        });

        this.busIdInformation$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.busIdData = data;
            this.busIdTemp = data.busId;
            this.operatorIdTemp = data.operator?.id || null;
            // console.log('this.busIdData', this.busIdData);

            if (data?.msgID === MsgID.COMMISSION_BUS_ID_SUBMIT && data?.status === ResponseStatus.SUCCESS) {
                this.store.dispatch(
                    updateFareConsole({
                        payload: {
                            ...this.fareConsoleSetting,
                            busId: this.busIdData.busId,
                        },
                        msgID: MsgID.FARE_CONSOLE,
                    }),
                );
                this.store.dispatch(
                    updateCommissionBusIdInformation({
                        payload: {
                            busId: '',
                            operator: {
                                id: 0,
                                label: '',
                                serviceProvider: 0,
                            },
                            status: undefined,
                            message: undefined,
                        },
                    }),
                );
                this.backToFareConsole();
            }
        });
    }

    handleChangeSetting(setting: string) {
        this.settingType = setting;
        switch (setting) {
            case 'deckType':
                this.selectChangeDeckType();
                break;
            case 'busId':
                this.selectChangeBusId();
                break;
        }
    }

    // DECK TYPE HANDLE
    selectChangeDeckType() {
        if (!this.fareConsoleSetting?.deckTypeList?.length) {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.DECK_TYPE_LIST,
                msgSubID: MsgSubID.REQUEST,
                payload: {},
            });
        }
    }

    handleChangeDeckType(id: number) {
        this.selectedDeckTypeId = id;
    }

    handleConfirmDeckType(isConfirm: boolean) {
        if (isConfirm) {
            const nextSetting = { ...this.fareConsoleSetting };
            const nextDeckType = this.fareConsoleSetting.deckTypeList?.find(
                (deck) => deck.id === this.selectedDeckTypeId,
            );
            if (nextDeckType) {
                nextSetting.deckType = nextDeckType;
            }

            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.DECK_TYPE_SUBMIT,
                msgSubID: MsgSubID.NOTIFY,
                payload: {
                    deckType: this.selectedDeckTypeId,
                },
            });
            this.store.dispatch(
                updateFareConsole({
                    payload: nextSetting,
                    msgID: MsgID.FARE_CONSOLE,
                }),
            );
        } else {
            this.selectedDeckTypeId = this.fareConsoleSetting.deckType?.id || 0;
        }
        this.settingType = '';
    }

    // BLS STATUS HANDLE
    handleChangeBlsStatus(status: number) {
        this.selectedBlsStatus = status;
        this.blsStep = 2;
    }

    handleConfirmBlsStatus(isConfirm: boolean) {
        if (isConfirm) {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.BLS_STATUS_SUBMIT,
                msgSubID: MsgSubID.NOTIFY,
                payload: {
                    blsStatus: this.selectedBlsStatus,
                },
            });
            this.store.dispatch(
                updateFareConsole({
                    payload: { ...this.fareConsoleSetting, blsStatus: this.selectedBlsStatus },
                    msgID: MsgID.FARE_CONSOLE,
                }),
            );
            this.settingType = '';
        }
        this.blsStep = 1;
    }

    // TIME AND DATE HANDLE
    handleClickBack() {
        this.settingType = '';
    }

    handleChangeInput(event: Event, type: string): void {
        const inputField = <HTMLInputElement>document.getElementById('inputField');
        const start = inputField?.selectionStart || 0;
        const end = inputField?.selectionEnd || 0;
        const value = inputField.value;
        const target = <HTMLDivElement>event.target;

        if (target.id === 'backspaceKey') {
            if (start === end) {
                // No selection, just delete the character before the cursor
                inputField.value = value.slice(0, start - 1) + value.slice(end);
                inputField.selectionStart = inputField.selectionEnd = start - 1;
            } else {
                // There is a selection, delete the selected text
                inputField.value = value.slice(0, start) + value.slice(end);
                inputField.selectionStart = inputField.selectionEnd = start;
            }
        } else if (target.id === 'enterKey') {
            if (!value) return;
            if (type === 'time') {
                this.handleConfirmTime(value);
            } else if (type === 'date') {
                this.handleConfirmDate(value);
            } else {
                this.handleConfirmComplimentaryDays(value);
            }
        } else {
            const keyValue = target.innerText.trim();
            inputField.value = value.slice(0, start) + keyValue + value.slice(end);
            inputField.selectionStart = inputField.selectionEnd = start + keyValue.length;
        }

        inputField.focus();
    }

    private handleConfirmTime(value: string) {
        if (isNaN(Number(value)) || value.length !== 6) {
            this.hasInputError = true;
            return;
        }

        const timeArray = value.match(/.{1,2}/g);
        const hhValue = Number(timeArray?.[0] || 0);
        const mmValue = Number(timeArray?.[1] || 0);
        const ssValue = Number(timeArray?.[2] || 0);
        if (hhValue > 24 || mmValue > 59 || ssValue > 59) {
            this.hasInputError = true;
            return;
        }

        if (hhValue === 24 && (mmValue > 0 || ssValue > 0)) {
            this.hasInputError = true;
            return;
        }
        this.hasInputError = false;

        this.submitTime(`${hhValue}:${mmValue}:${ssValue}`);
    }

    private submitTime(time: string) {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.TIME_SUBMIT,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                time,
            },
        });
        this.store.dispatch(
            updateFareConsole({
                payload: { ...this.fareConsoleSetting, time },
                msgID: MsgID.FARE_CONSOLE,
            }),
        );
        this.settingType = '';
    }

    private handleConfirmDate(value: string) {
        if (isNaN(Number(value)) || value.length !== 8) {
            this.hasInputError = true;
            return;
        }

        const dateArray = value.match(/.{1,2}/g);
        const ddValue = Number(dateArray?.[0] || 0);
        const mmValue = Number(dateArray?.[1] || 0);
        const yyyyValue = Number((dateArray?.[2] || '') + (dateArray?.[3] || ''));
        // const newDate = new Date(`${yyyyValue}/${mmValue}/${ddValue}`);

        const date = new Date(yyyyValue, mmValue - 1, ddValue);
        // console.log(
        //     date,
        //     date.getFullYear() == yyyyValue && date.getMonth() + 1 == mmValue && date.getDate() == ddValue,
        // );
        const validDate =
            date.getFullYear() == yyyyValue && date.getMonth() + 1 == mmValue && date.getDate() == ddValue;
        if (!validDate) {
            this.hasInputError = true;
            return;
        }

        this.hasInputError = false;
        this.submitDate(`${ddValue.toString().padStart(2, '0')}/${mmValue.toString().padStart(2, '0')}/${yyyyValue}`);
    }

    private submitDate(date: string) {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.DATE_SUBMIT,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                date,
            },
        });
        this.store.dispatch(
            updateFareConsole({
                payload: { ...this.fareConsoleSetting, date },
                msgID: MsgID.FARE_CONSOLE,
            }),
        );
        this.settingType = '';
    }

    // COMPLIMENTARY DAYS HANDLE

    private handleConfirmComplimentaryDays(value: string) {
        if (isNaN(Number(value))) {
            this.hasInputError = true;
            return;
        }

        if (
            this.fareConsoleSetting.maximumcomplimentaryDays &&
            Number(value) > this.fareConsoleSetting.maximumcomplimentaryDays
        ) {
            this.hasInputError = true;
            return;
        }

        this.hasInputError = false;
        this.submitComplimentaryDays(Number(value));
    }

    private submitComplimentaryDays(days: number) {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.COMPLIMENTARY_DAYS_SUBMIT,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                complimentaryDays: days,
            },
        });
        this.store.dispatch(
            updateFareConsole({
                payload: { ...this.fareConsoleSetting, complimentaryDays: days },
                msgID: MsgID.FARE_CONSOLE,
            }),
        );
        this.settingType = '';
    }

    // DELETE PARAMETERS HANDLE
    handleDeleteParameter() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.DELETE_PARAMETER,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
    }

    handleClearDeleteParameter() {
        this.store.dispatch(
            updateFareConsole({
                payload: { ...this.fareConsoleSetting, message: '', percentage: 0, status: undefined },
                msgID: MsgID.FARE_CONSOLE,
            }),
        );
        this.settingType = '';
    }

    // BUS ID HANDLE
    private _handleOnDocumentClick(): void {
        this._document.addEventListener('click', (event: Event) => {
            const target = event.target || event.srcElement || event.currentTarget;
            const idAttr = target?.['id'];
            const parentNode = target?.['parentNode']?.['className'];
            // console.log('event', event);
            // console.log('parentNode', parentNode);
            // console.log('numeric-keyboard', parentNode?.includes('numeric-keyboard'));
            // // console.log('event.target()', idAttr);
            // // console.log('event.composedPath()', event.composedPath());
            const isClickKeyboard = parentNode?.includes('numeric-keyboard');
            if (!isClickKeyboard && this.isShowKeyboard) {
                this.isShowKeyboard = false;
            }

            if (idAttr === 'inputField' && !this.isShowKeyboard) {
                this.isShowKeyboard = true;
            }
        });
    }

    selectChangeBusId() {
        if (!this.busIdData?.operators?.length) {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.COMMISSION_OPERATOR,
                msgSubID: MsgSubID.REQUEST,
                payload: {},
            });
        }

        if (this.fareConsoleSetting.busId) {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.COMMISSION_BUS_ID,
                msgSubID: MsgSubID.REQUEST,
                payload: {
                    busId: this.fareConsoleSetting.busId,
                },
            });
        }
    }

    backToFareConsole() {
        this.handleClickBack();
    }

    handleChangeStep(step: number) {
        this.busIdStep = step;
    }

    handleBusIdBack() {
        this.busIdPrefix = '';
        this.busIdNumber = '';
        this.hasBusIdNumberError = false;
        this.busIdStep = 1;
    }

    handleEnterBusId(value: string) {
        this.busIdNumber = value;
        this.isShowKeyboard = false;
        this.hasBusIdNumberError = false;
    }

    handleChangeBusIdInput(event: Event): void {
        const inputField = <HTMLInputElement>document.getElementById('inputField');
        const start = inputField?.selectionStart || 0;
        const end = inputField?.selectionEnd || 0;
        const value = inputField.value;
        const target = <HTMLDivElement>event.target;

        if (target.id === 'backspaceKey') {
            if (start === end) {
                // No selection, just delete the character before the cursor
                this.busIdNumber = inputField.value = value.slice(0, start - 1) + value.slice(end);
                inputField.selectionStart = inputField.selectionEnd = start - 1;
            } else {
                // There is a selection, delete the selected text
                this.busIdNumber = inputField.value = value.slice(0, start) + value.slice(end);
                inputField.selectionStart = inputField.selectionEnd = start;
            }
        } else if (target.id === 'enterKey') {
            if (!value) return;
            this.handleEnterBusId(value);
        } else {
            const keyValue = target.innerText.trim();
            this.busIdNumber = inputField.value = value.slice(0, start) + keyValue + value.slice(end);
            inputField.selectionStart = inputField.selectionEnd = start + keyValue.length;
        }

        inputField.focus();
    }

    handleSubmitBusId() {
        if (!this.busIdPrefix) {
            return;
        }
        if (this.busIdNumber.length > 4 || this.busIdNumber.length < 1) {
            this.hasBusIdNumberError = true;
            return;
        }
        this.busIdStep = 1;
        this.store.dispatch(
            updateCommissionBusIdInformation({
                payload: { ...this.busIdData, busId: this.busIdPrefix + this.busIdNumber.padStart(4, '0') },
                msgID: this.busIdData.msgID,
            }),
        );

        this.busIdPrefix = '';
        this.busIdNumber = '';
        this.hasBusIdNumberError = false;
    }

    handleChangeOperator(operatorId: number) {
        // console.log('operatorId', operatorId);
        // console.log('operatorIdTemp', this.operatorIdTemp);

        this.operatorIdTemp = operatorId;
    }

    handleConfirmOperator() {
        const newOperator = this.busIdData?.operators?.find((operator) => operator.id === this.operatorIdTemp);
        if (newOperator) {
            this.store.dispatch(
                updateCommissionBusIdInformation({
                    payload: { ...this.busIdData, operator: newOperator },
                    msgID: this.busIdData.msgID,
                }),
            );
        }
        this.busIdStep = 1;
    }

    handleOperatorBack() {
        this.operatorIdTemp = this.busIdData?.operator?.id || null;
        this.busIdStep = 1;
    }

    handleSubmitForm() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.COMMISSION_BUS_ID_SUBMIT,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                busId: this.busIdData.busId,
                serviceProvider: this.busIdData?.operator?.serviceProvider,
            },
        });
        this.store.dispatch(
            updateFareConsole({
                payload: { ...this.fareConsoleSetting, busId: this.busIdData.busId },
                msgID: MsgID.FARE_CONSOLE,
            }),
        );

        this.settingType = '';
        this.busIdStep = 1;
    }

    handleRetrySetBusId() {
        this.busIdStep = 1;
        this.store.dispatch(
            updateCommissionBusIdInformation({
                payload: { ...this.busIdData, status: undefined, message: undefined },
            }),
        );
    }

    // SUBMIT FARE CONSOLE
    validateFareConsoleForm() {
        return [
            this.fareConsoleSetting.deckType.id,
            this.fareConsoleSetting.time,
            this.fareConsoleSetting.date,
            this.fareConsoleSetting.busId,
            this.fareConsoleSetting.complimentaryDays,
            this.fareConsoleSetting.blsStatus,
        ].every((value) => !!value);
    }

    handleConfirmFareConsole(isConfirm: boolean): void {
        if (isConfirm) {
            if (!this.validateFareConsoleForm()) {
                this.hasSubmitError = true;
                return;
            }
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.FARE_CONSOLE_SUBMIT,
                msgSubID: MsgSubID.NOTIFY,
                payload: {
                    deckType: this.fareConsoleSetting.deckType.id,
                    blsStatus: this.fareConsoleSetting.blsStatus,
                    time: this.fareConsoleSetting.time,
                    date: this.fareConsoleSetting.date,
                    busId: this.fareConsoleSetting.busId,
                    complimentaryDays: this.fareConsoleSetting.complimentaryDays,
                },
            });
        } else {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.FARE_CONSOLE_CANCEL,
                msgSubID: MsgSubID.NOTIFY,
                payload: {},
            });
        }
    }

    handleBackToConfiguration() {
        this.hasSubmitError = false;
    }

    ngOnDestroy() {
        this._document.removeEventListener('click', this._handleOnDocumentClick, false);

        // Emit to destroy all active subscriptions
        this.destroy$.next();
        this.destroy$.complete();
    }
}
