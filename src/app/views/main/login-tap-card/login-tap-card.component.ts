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
import { tapCardLogin, outOfService, updateTapCardLogin, updateLanguage } from '@store/main/main.reducer';
import { MqttService, Topics } from '@services/mqtt.service';
import { ITapCardLogin, MsgID, MsgSubID, IOutOfService, ResponseStatus, DEFAULT_TIMEOUT } from '@models';

@Component({
    selector: 'app-login-tap-card',
    standalone: true,
    imports: [CommonModule, MatButton, TranslateModule, CustomKeyboardComponent],
    templateUrl: './login-tap-card.component.html',
    styleUrl: './login-tap-card.component.scss',
})
export class LoginTapCardComponent implements OnInit {
    private destroy$ = new Subject<void>();
    MsgID = MsgID;
    ResponseStatus = ResponseStatus;

    signInTapCard$: Observable<ITapCardLogin>;
    signInTapCardData: ITapCardLogin = {};

    outOfService$: Observable<IOutOfService>;
    outOfServiceData: IOutOfService = {};

    inputValue: string = '';
    dutyInputValue: string = '';
    currentLanguage = '';

    pinError: string = '';
    topics;
    intervalId;
    timeoutId;

    constructor(
        private translate: TranslateService,
        private store: Store<AppState>,
        private router: Router,
        private mqttService: MqttService,
    ) {
        this.signInTapCard$ = this.store.select(tapCardLogin);
        this.outOfService$ = this.store.select(outOfService);
        this.currentLanguage = this.translate.currentLang?.toUpperCase() || 'EN';
    }

    ngOnInit() {
        this.signInTapCard$.pipe(takeUntil(this.destroy$)).subscribe((data: ITapCardLogin) => {
            this.signInTapCardData = data || {};
            console.log('signInTapCardData', this.signInTapCardData);

            clearTimeout(this.intervalId);
            clearTimeout(this.timeoutId);
            if (data.timeout && data.timeout > 0) {
                this.intervalId = setTimeout(() => {
                    this.mqttService.publishWithMessageFormat({
                        topic: this.topics?.mainTab?.get,
                        msgID: MsgID.TIMEOUT_MESSAGE,
                        msgSubID: MsgSubID.NOTIFY,
                        payload: {
                            msgID: data.msgID,
                        },
                    });
                }, data.timeout);
            }

            if (
                (data.msgID === MsgID.BC_TAP_CARD_LOGIN || data.msgID === MsgID.MS_TAP_CARD_LOGIN) &&
                data.status === ResponseStatus.ERROR
            ) {
                this.timeoutId = setTimeout(() => {
                    this.backToLogin();
                }, DEFAULT_TIMEOUT);
            } else {
                clearTimeout(this.timeoutId);
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
    // this.mqttService.publishWithFormat(this.topics?.mainTab?.response, {
    //     messaged: {
    //         status: AuthStatus?.SIGN_IN_TAP_CARD,
    //     },
    //     messageId: MessageId?.AUTH,
    //     messageType: MqttTypes?.BE_RESPONSE,
    // });
    // }

    handleChangeInput(event: Event, type: string, isMS?: boolean): void {
        const inputField = <HTMLInputElement>document.getElementById('inputField');
        const start = inputField?.selectionStart || 4;
        const end = inputField?.selectionEnd || 4;
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
            this.inputValue = value;
            if (type === 'PIN') {
                this.submitPIN(isMS);
            } else {
                this.submitDutyNumber();
            }
        } else {
            const keyValue = target.innerText.trim();
            inputField.value = value.slice(0, start) + keyValue + value.slice(end);
            inputField.selectionStart = inputField.selectionEnd = start + keyValue.length;
        }
        inputField.focus();
    }

    private submitPIN(isMS?: boolean): void {
        this.pinError = '';
        if (this.inputValue.length > 6) {
            this.pinError = 'PIN_MAX_LENGTH';
            return;
        }
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: isMS ? MsgID.MS_TAP_CARD_PIN : MsgID.BC_TAP_CARD_PIN,
            msgSubID: MsgSubID.REQUEST,
            payload: {
                pin: this.inputValue,
            },
        });

        this.store.dispatch(
            updateTapCardLogin({
                payload: {
                    ...this.signInTapCardData,
                    pin: this.inputValue,
                    timeout: undefined,
                },
                msgID: this.signInTapCardData?.msgID,
            }),
        );
    }

    private submitDutyNumber(): void {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.BC_TAP_CARD_DUTY,
            msgSubID: MsgSubID.REQUEST,
            payload: {
                dutyNumber: this.inputValue,
            },
        });
    }

    backToLogin() {
        this.router.navigate(['/main/login']);
    }

    // goBack() {
    //     this.mqttService.publishWithFormat(this.topics?.mainTab?.response, {
    //         messaged: {
    //             status: AuthStatus?.SIGN_IN,
    //         },
    //         messageId: MessageId?.AUTH,
    //         messageType: MqttTypes?.BE_RESPONSE,
    //     });
    // }

    handleChangeLanguage(lang: string): void {
        this.currentLanguage = lang;
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.maintenance?.get,
            msgID: MsgID.LANGUAGE_SUBMIT,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                language: lang,
            },
        });
        this.store.dispatch(
            updateLanguage({
                payload: { language: lang },
                msgID: MsgID?.LANGUAGE,
            }),
        );
        this.translate.use(lang.toLocaleLowerCase());
    }

    ngOnDestroy() {
        clearTimeout(this.intervalId);
        clearTimeout(this.timeoutId);
        this.destroy$.next();
        this.destroy$.complete();

        this.store.dispatch(
            updateTapCardLogin({
                payload: {},
                msgID: undefined,
            }),
        );
    }
}
