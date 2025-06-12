import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule to use ngModel

import { AppState } from '@store/app.state';
import { Store } from '@ngrx/store';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IOutOfService, MsgID, MsgSubID, TopicsKeys, ResponseStatus } from '@models';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';
import { MqttService } from '@services/mqtt.service';
import { language, updateLanguage, outOfService } from '@store/main/main.reducer';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, MatButton, FormsModule, TranslateModule, CustomKeyboardComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    ResponseStatus = ResponseStatus;
    currentLanguage: string = '';
    showKeyboard: boolean = false;
    outOfService$: Observable<IOutOfService>;
    outOfServiceData: IOutOfService = {};
    private mqttSubscriptions: Array<{
        topic: string;
        topicKey: string;
    }> = []; // Track MQTT topics for cleanup
    commissionError: string | null = null;
    topics;

    constructor(
        private translate: TranslateService,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        this.currentLanguage = this.translate.currentLang?.toUpperCase() || 'EN';
        this.outOfService$ = this.store.select(outOfService);
    }

    ngOnInit() {
        this.outOfService$?.pipe(takeUntil(this.destroy$)).subscribe((outOfSer: IOutOfService) => {
            this.outOfServiceData = outOfSer;
        });

        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                const topics = this.mqttService.mqttConfig?.topics;
                this.topics = topics;
            }
        });
    }

    handleChangeLanguage(lang: string) {
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

    handleSubmit(value) {
        this.commissionError = null;
        if (!value.length) {
            this.commissionError = 'INVALID_ENTRY';
            return;
        }

        this.mqttService?.publishWithMessageFormat({
            topic: this.topics.mainTab?.get,
            msgID: MsgID?.LOGIN_COMMISSIONING,
            msgSubID: MsgSubID?.REQUEST,
            payload: { value },
        });
    }
    handleChangeInput(event: Event): void {
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
            this.handleSubmit(value);
        } else {
            const keyValue = target.innerText.trim();
            inputField.value = value.slice(0, start) + keyValue + value.slice(end);
            inputField.selectionStart = inputField.selectionEnd = start + keyValue.length;
        }
        inputField.focus();
    }

    showKeyboardHandler() {
        this.showKeyboard = !this.showKeyboard;
        const inputField = <HTMLInputElement>document.getElementById('inputField');
        inputField.value = '';
        this.commissionError = null;
        if (this.showKeyboard) {
            inputField.focus();
        }

        if (this.showKeyboard && this.mqttSubscriptions?.length === 0) {
            this.mqttService.subscribe({
                topic: this.topics.mainTab?.response,
                topicKey: TopicsKeys?.COMMISSIONING_DIGIT_KEY_IN,
                callback: (message) => {
                    const { header, payload } = JSON.parse(message);
                    if (header?.msgID === MsgID?.LOGIN_COMMISSIONING && header?.msgSubID === MsgSubID?.RESPONSE) {
                        if (payload.status === ResponseStatus.ERROR) {
                            this.commissionError = 'INVALID_ENTRY';
                        } else if (payload.status === ResponseStatus.SUCCESS) {
                            this.showKeyboard = false;
                        }
                    }
                },
            });
            this.mqttSubscriptions.push({
                topic: this.topics.mainTab?.response,
                topicKey: TopicsKeys?.COMMISSIONING_DIGIT_KEY_IN,
            });
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.mqttSubscriptions?.length > 0) {
            this.mqttSubscriptions.forEach((topic) => {
                this.mqttService.unsubscribe(topic?.topic, topic?.topicKey);
            });
        }
    }
}
