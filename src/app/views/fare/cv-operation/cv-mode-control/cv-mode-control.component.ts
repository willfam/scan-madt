import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomSwitchComponent } from '@components/custom-switch/custom-switch.component';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { ICVModeControl, MsgID, MsgSubID } from '@models';
import { AppState } from '@store/app.state';
import { cvModeControl, updateCVModeControl } from '@store/fare/fare.reducer';

@Component({
    standalone: true,
    selector: 'cv-mode-control',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        NgIf,
        ReactiveFormsModule,
        ConfirmDialogComponent,
        CustomSwitchComponent,
    ],
    templateUrl: './cv-mode-control.component.html',
    styleUrls: ['./cv-mode-control.component.scss'],
})
export class CVModeControlComponent implements OnInit {
    private destroy$ = new Subject<void>();
    private cvModeControl$: Observable<ICVModeControl>;
    cvModeControl: ICVModeControl = {
        always: false,
        normal: false,
    };
    topics;

    constructor(
        private router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        this.cvModeControl$ = this.store.select(cvModeControl);
    }
    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
                this.mqttService.publishWithMessageFormat({
                    topic: this.topics?.fareTab?.get,
                    msgID: MsgID.FARE_CV_MODE_CONTROL,
                    msgSubID: MsgSubID.REQUEST,
                    payload: {},
                });
            }
        });

        this.cvModeControl$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.cvModeControl = data;
        });
    }

    handleToggleStatus() {
        const payload: ICVModeControl = {
            always: !this.cvModeControl.always,
            normal: !this.cvModeControl.normal,
        };

        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.fareTab?.get,
            msgID: MsgID.FARE_CHANGE_CV_MODE_CONTROL,
            msgSubID: MsgSubID.NOTIFY,
            payload,
        });
        this.store.dispatch(updateCVModeControl({ payload }));
    }

    goBack() {
        this.router.navigate(['/fare/cv-operation']);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
