import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { MqttService, Topics } from '@services/mqtt.service';
import { IManualLogin, MsgID, MsgSubID, IOutOfService, ResponseStatus } from '@models';
import { updateManualLogin, manualLogin, outOfService } from '@store/main/main.reducer';

@Component({
    selector: 'app-login-manual',
    standalone: true,
    imports: [CommonModule, MatButton, TranslateModule, CustomKeyboardComponent],
    templateUrl: './login-manual.component.html',
    styleUrl: './login-manual.component.scss',
})
export class LoginManualComponent implements OnInit {
    private destroy$ = new Subject<void>();
    MsgID = MsgID;
    ResponseStatus = ResponseStatus;

    manualLogin$: Observable<IManualLogin>;
    manualLoginData: IManualLogin = {};

    outOfService$: Observable<IOutOfService>;
    outOfServiceData: IOutOfService = {};

    inputValue: string = '';
    currentLanguage = '';

    pinError: string = '';
    topics;
    intervalId;

    constructor(
        private translate: TranslateService,
        private store: Store<AppState>,
        private router: Router,
        private mqttService: MqttService,
    ) {
        this.manualLogin$ = this.store.select(manualLogin);
        this.outOfService$ = this.store.select(outOfService);
        this.currentLanguage = this.translate.currentLang?.toUpperCase() || '';
    }

    ngOnInit() {
        this.manualLogin$.pipe(takeUntil(this.destroy$)).subscribe((data: IManualLogin) => {
            this.manualLoginData = data || {};
            console.log('manualLoginData', this.manualLoginData);

            clearTimeout(this.intervalId);
            if (data.timeout && data.timeout > 0) {
                this.intervalId = setTimeout(() => {
                    this.mqttService.publishWithMessageFormat({
                        topic: this.topics?.mainTab?.get,
                        msgID: MsgID.TIMEOUT_MESSAGE,
                        msgSubID: MsgSubID.NOTIFY,
                        payload: {
                            msgID: data.msgSubID === MsgSubID.NOTIFY ? MsgID.MANUAL_LOGIN_PIN : MsgID.MANUAL_LOGIN_PIN2,
                        },
                    });
                }, data.timeout);
            }
        });

        this.outOfService$?.pipe(takeUntil(this.destroy$)).subscribe((outOfSer: IOutOfService) => {
            this.outOfServiceData = outOfSer;
        });

        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });
    }

    // handleRetryTapCard(): void {
    //     this.mqttService.publishWithFormat(this.topics?.mainTab?.response, {
    //         messaged: {
    //             status: AuthStatus?.SIGN_IN_TAP_CARD,
    //         },
    //         messageId: MessageId?.AUTH,
    //         messageType: MqttTypes?.BE_RESPONSE,
    //     });
    // }

    handleChangeInput(event: Event, key: string): void {
        const inputField = <HTMLInputElement>document.getElementById(key);
        const start = inputField?.selectionStart || (key === 'inputDutyIdField' ? 4 : 0);
        const end = inputField?.selectionEnd || (key === 'inputDutyIdField' ? 4 : 0);

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
            this.submitValue(value, key);

            // this.inputValue = value;
            // if (type === 'PIN') {
            //     this.submitPIN(isMS);
            // } else {
            //     this.submitDutyNumber();
            // }
        } else {
            const keyValue = target.innerText.trim();
            inputField.value = value.slice(0, start) + keyValue + value.slice(end);
            inputField.selectionStart = inputField.selectionEnd = start + keyValue.length;
        }
        inputField.focus();
    }

    private submitValue(value, field: string): void {
        if (field === 'inputPinField') {
            this.pinError = '';
            if (value.length > 6) {
                this.pinError = 'PIN_MAX_LENGTH';
                return;
            }
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.MANUAL_LOGIN_PIN2,
                msgSubID: MsgSubID.REQUEST,
                payload: {
                    pin: value,
                },
            });
        } else if (field === 'inputStaffIdField') {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.MANUAL_LOGIN_STAFF_ID,
                msgSubID: MsgSubID.REQUEST,
                payload: {
                    staffId: value,
                },
            });
        } else if (field === 'inputDutyField') {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.MANUAL_LOGIN_DUTY,
                msgSubID: MsgSubID.REQUEST,
                payload: {
                    dutyNumber: value,
                },
            });
        }
    }

    backToLogin() {
        this.router.navigate(['/main/login']);
        this.store.dispatch(updateManualLogin({ payload: {} }));
    }

    backToEnterPIN() {
        this.store.dispatch(updateManualLogin({ payload: {} }));
    }

    backToEnterStaffId() {
        this.store.dispatch(
            updateManualLogin({ payload: { status: ResponseStatus.SUCCESS }, msgID: MsgID.MANUAL_LOGIN_PIN2 }),
        );
    }

    ngOnDestroy() {
        clearTimeout(this.intervalId);
        this.destroy$.next();
        this.destroy$.complete();

        this.store.dispatch(updateManualLogin({ payload: {} }));
    }
}
