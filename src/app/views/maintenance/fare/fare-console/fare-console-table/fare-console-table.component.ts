import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { MqttService, Topics } from '@services/mqtt.service';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { fareConsole, updateFareConsole } from '@store/maintenance/maintenance.reducer';
import { IFareConsole, MsgID, MsgSubID, ResponseStatus } from '@models';

import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';

@Component({
    standalone: true,
    selector: 'maintenance-fare-console-table',
    imports: [CommonModule, TranslateModule, NgScrollbarModule, CustomKeyboardComponent],
    templateUrl: './fare-console-table.component.html',
    styleUrls: ['./fare-console-table.component.scss'],
})
export class FareConsoleTableComponent implements OnDestroy, OnInit {
    urlPrefix: string = '/maintenance/fare/fare-console';
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
    topics;

    selectedDeckTypeId: number = 0;

    blsStep = 1;
    selectedBlsStatus: number = 0;

    hasInputError = false;

    constructor(
        private router: Router,
        private mqttService: MqttService,
        private store: Store<AppState>,
    ) {
        this.fareConsole$ = this.store.select(fareConsole);
    }

    ngOnInit() {
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
    }

    handleChangeSetting(setting: string) {
        this.settingType = setting;
        switch (setting) {
            case 'deckType':
                this.selectChangeDeckType();
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
                    blsStatus: this.selectedBlsStatus === 1 ? true : false,
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

    private handleConfirmComplimentaryDays(value: string) {
        if (isNaN(Number(value))) {
            this.hasInputError = true;
            return;
        }

        this.hasInputError = false;
        this.submitComplimentaryDays(Number(value));
    }

    // COMPLIMENTARY DAYS HANDLE
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

    handleConfirmFareConsole(): void {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.MAINTENANCE_FARE_CONSOLE_SUBMIT,
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

        this.store.dispatch(
            updateFareConsole({
                payload: {
                    ...this.fareConsoleSetting,
                    isSubmitted: true,
                },
                msgID: MsgID.FARE_CONSOLE,
            }),
        );
    }

    handleNavigate(url: string): void {
        if (this.fareConsoleSetting.isSubmitted) {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.maintenance?.get,
                msgID: MsgID.MAINTENANCE_FARE_CONSOLE,
                msgSubID: MsgSubID.REQUEST,
                payload: {},
            });
            this.store.dispatch(
                updateFareConsole({
                    payload: {
                        ...this.fareConsoleSetting,
                        isSubmitted: false,
                    },
                    msgID: MsgID.FARE_CONSOLE,
                }),
            );
        }
        this.router.navigate([this.urlPrefix + url]);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
