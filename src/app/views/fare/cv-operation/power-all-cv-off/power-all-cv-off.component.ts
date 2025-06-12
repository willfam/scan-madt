import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';

import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { MsgID, MsgSubID } from '@models';
import { AppState } from '@store/app.state';

@Component({
    standalone: true,
    selector: 'power-all-cv-off',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        TranslateModule,
        ConfirmDialogComponent,
        CustomKeyboardComponent,
    ],
    templateUrl: './power-all-cv-off.component.html',
    styleUrls: ['./power-all-cv-off.component.scss'],
})
export class PowerAllCVOffComponent implements OnInit {
    private destroy$ = new Subject<void>();
    type = '';
    topics;

    constructor(
        private router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {}
    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });
    }

    handleConfirm(isConfirm: boolean) {
        if (isConfirm) {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.fareTab?.get,
                msgID: MsgID.FARE_POWER_ALL_CV,
                msgSubID: MsgSubID.NOTIFY,
                payload: {
                    allCVs: false,
                },
            });
        }
        this.goBack();
    }

    goBack() {
        this.router.navigate(['/fare/cv-operation']);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
