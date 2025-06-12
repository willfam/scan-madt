import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';
import { TranslateModule } from '@ngx-translate/core';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { IFareConsole, MsgID, MsgSubID } from '@models';
import { AppState } from '@store/app.state';
import { fareConsole, updateFareConsole } from '@store/maintenance/maintenance.reducer';

@Component({
    standalone: true,
    selector: 'date-setting',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        ConfirmDialogComponent,
        CustomKeyboardComponent,
        TranslateModule,
    ],
    templateUrl: './date-setting.component.html',
    styleUrls: ['./date-setting.component.scss'],
})
export class DateSettingComponent implements OnInit {
    private destroy$ = new Subject<void>();
    fareConsoleSetting$: Observable<IFareConsole>;
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

    hasInputError: boolean = false;
    topics;

    constructor(
        private router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        this.fareConsoleSetting$ = this.store.select(fareConsole);
    }

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });

        this.fareConsoleSetting$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.fareConsoleSetting = data;
        });
    }

    goBack() {
        this.router.navigate(['/maintenance/fare/fare-console']);
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
        const date = new Date(yyyyValue, mmValue - 1, ddValue);

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
            topic: this.topics?.maintenance?.get,
            msgID: MsgID.MAINTENANCE_DATE_SUBMIT,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                date,
            },
        });
        this.store.dispatch(
            updateFareConsole({
                payload: { ...this.fareConsoleSetting, date },
                msgID: MsgID.MAINTENANCE_FARE_CONSOLE,
            }),
        );
        this.goBack();
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
            this.handleConfirmDate(value);
        } else {
            const keyValue = target.innerText.trim();
            inputField.value = value.slice(0, start) + keyValue + value.slice(end);
            inputField.selectionStart = inputField.selectionEnd = start + keyValue.length;
        }

        inputField.focus();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
