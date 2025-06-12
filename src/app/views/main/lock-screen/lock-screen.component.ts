import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from '@components/dialog/dialog.component';

import { MqttService, Topics } from '@services/mqtt.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { MsgID, MsgSubID, ResponseStatus, ILockScreen } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { lockScreen, updateLockScreen } from '@store/main/main.reducer';
import { routerUrls } from '@app/app.routes';

@Component({
    standalone: true,
    selector: 'lock-screen',
    imports: [
        CommonModule,
        RouterModule,
        ConfirmDialogComponent,
        DialogComponent,
        CustomKeyboardComponent,
        TranslateModule,
    ],
    templateUrl: './lock-screen.component.html',
    styleUrls: ['./lock-screen.component.scss'],
})
export class LockScreenComponent implements OnInit {
    step: number;
    inputValue: string;
    MsgID = MsgID;
    private destroy$ = new Subject<void>();
    ResponseStatus = ResponseStatus;

    lockScreen$: Observable<ILockScreen>;
    lockScreen: ILockScreen = {};

    topics;

    constructor(
        private router: Router,
        private mqttService: MqttService,
        private store: Store<AppState>,
    ) {
        this.step = 1;
        this.inputValue = '';
        this.lockScreen$ = this.store.select(lockScreen);
    }

    ngOnInit() {
        this.lockScreen$.pipe(takeUntil(this.destroy$)).subscribe((lockScreen: ILockScreen) => {
            this.lockScreen = lockScreen || {};
            // console.log({ lockScreen });
            // if (lockScreen.msgID === MsgID.LOCK_CONFIRM) {
            //     document.getElementById('lock-btn')?.classList.add('hidden'); // Hide lock button
            // }

            // if (lockScreen.msgID === MsgID.UNLOCK_SUBMIT && lockScreen.status === ResponseStatus.SUCCESS) {
            //     // this.router.navigate([routerUrls.private.main.busStopInformation]);
            //     document.getElementById('lock-btn')?.classList.remove('hidden');
            // }

            const showLockBtn = !lockScreen.msgID || lockScreen.msgID === MsgID.LOCK;
            if (!showLockBtn) {
                document.getElementById('lock-btn')?.classList.add('hidden');
                document.getElementById('end-trip-btn')?.classList.add('hidden');
            } else {
                document.getElementById('lock-btn')?.classList.remove('hidden');
                document.getElementById('end-trip-btn')?.classList.remove('hidden');
            }
        });

        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });
    }

    backToMain() {
        this.router.navigate(['/main']);
    }

    handleBack() {
        this.store.dispatch(
            updateLockScreen({
                payload: { ...this.lockScreen },
                msgID: MsgID.LOCK_CONFIRM,
            }),
        );
    }

    handleConfirm(isConfirm: boolean) {
        if (isConfirm) {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics.mainTab?.get,
                msgID: MsgID.LOCK_CONFIRM,
                msgSubID: MsgSubID.NOTIFY,
            });

            this.store.dispatch(
                updateLockScreen({
                    payload: { ...this.lockScreen },
                    msgID: MsgID.LOCK_CONFIRM,
                }),
            );
        } else {
            this.backToMain();
        }
    }

    handleUnlock() {
        this.store.dispatch(
            updateLockScreen({
                payload: { ...this.lockScreen, status: undefined },
                msgID: MsgID.UNLOCK_SUBMIT,
            }),
        );
    }

    handleConfirmUnlock(code: string) {
        if (!code) return;
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.mainTab?.get,
            msgID: MsgID.UNLOCK_SUBMIT,
            msgSubID: MsgSubID.REQUEST,
            payload: { code },
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
            if (!value) return;
            this.inputValue = value;
            this.handleConfirmUnlock(value);
        } else {
            const keyValue = target.innerText.trim();
            inputField.value = value.slice(0, start) + keyValue + value.slice(end);
            inputField.selectionStart = inputField.selectionEnd = start + keyValue.length;
        }

        inputField.focus();
    }

    ngOnDestroy() {
        document.getElementById('lock-btn')?.classList.remove('hidden');
        document.getElementById('end-trip-btn')?.classList.remove('hidden');
        this.destroy$.next();
        this.destroy$.complete();
        this.store.dispatch(updateLockScreen({ payload: {}, msgID: undefined }));
        // this.resetEndTripInfo();
    }
}
