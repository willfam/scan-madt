import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomSwitchComponent } from '@components/custom-switch/custom-switch.component';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { ICVPowerControl, MsgID, MsgSubID } from '@models';
import { AppState } from '@store/app.state';
import { cvPowerControl, updateCVPowerControl } from '@store/fare/fare.reducer';

@Component({
    standalone: true,
    selector: 'cv-power-control',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        NgScrollbarModule,
        ConfirmDialogComponent,
        CustomSwitchComponent,
    ],
    templateUrl: './cv-power-control.component.html',
    styleUrls: ['./cv-power-control.component.scss'],
})
export class CVPowerControlComponent implements OnInit {
    private destroy$ = new Subject<void>();
    private cvPowerControl$: Observable<ICVPowerControl>;
    cvPowerControl: ICVPowerControl = {
        group: [],
    };
    topics;

    constructor(
        private router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        this.cvPowerControl$ = this.store.select(cvPowerControl);
    }
    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
                this.mqttService.publishWithMessageFormat({
                    topic: this.topics?.fareTab?.get,
                    msgID: MsgID.FARE_CV_POWER_CTRL,
                    msgSubID: MsgSubID.REQUEST,
                    payload: {},
                });
            }
        });

        this.cvPowerControl$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.cvPowerControl = data;
        });
    }

    handleToggleStatus(id: number) {
        const idx = this.cvPowerControl.group.findIndex((item) => item.id === id);
        // const nextGroup = [];
        const nextGroup = this.cvPowerControl.group.map((item) => ({ ...item }));
        nextGroup[idx].status = !nextGroup[idx].status;

        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.fareTab?.get,
            msgID: MsgID.FARE_CHANGE_CV_POWER_CTRL,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                groupId: id,
                status: nextGroup[idx].status,
            },
        });
        this.store.dispatch(
            updateCVPowerControl({
                payload: {
                    ...this.cvPowerControl,
                    group: nextGroup,
                },
            }),
        );
    }

    goBack() {
        this.router.navigate(['/fare/cv-operation']);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
