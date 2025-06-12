import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomSwitchComponent } from '@components/custom-switch/custom-switch.component';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { ICVEntryExitControl, MsgID, MsgSubID } from '@models';
import { AppState } from '@store/app.state';
import { cvEntryExitControl, updateCVEntryExit } from '@store/fare/fare.reducer';

@Component({
    standalone: true,
    selector: 'set-cv-entry-exit',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        TranslateModule,
        ConfirmDialogComponent,
        CustomSwitchComponent,
    ],
    templateUrl: './set-cv-entry-exit.component.html',
    styleUrls: ['./set-cv-entry-exit.component.scss'],
})
export class SetCVEntryExitComponent implements OnInit {
    private destroy$ = new Subject<void>();
    private cvEntryExitControl$: Observable<ICVEntryExitControl>;
    cvEntryExitControl: ICVEntryExitControl = {
        cvType: 0,
    };
    cvType: number = 0;
    type = '';
    topics;

    constructor(
        private router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        this.cvEntryExitControl$ = this.store.select(cvEntryExitControl);
    }

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
                this.mqttService.publishWithMessageFormat({
                    topic: this.topics?.fareTab?.get,
                    msgID: MsgID.FARE_SET_CV_ENTRY_EXIT,
                    msgSubID: MsgSubID.REQUEST,
                    payload: {},
                });
            }
        });

        this.cvEntryExitControl$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.cvEntryExitControl = data;
            this.cvType = data.cvType;

            // console.log('this.cvEntryExitControl', this.cvEntryExitControl);
        });
    }

    handleSelectType(type: number) {
        this.cvType = type;
    }

    handleSubmitType(isConfirm: boolean) {
        if (isConfirm) {
            if (!this.cvType) return;
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.fareTab?.get,
                msgID: MsgID.FARE_SET_CV_ENTRY_EXIT,
                msgSubID: MsgSubID.NOTIFY,
                payload: {
                    cvType: this.cvType,
                },
            });
            this.store.dispatch(
                updateCVEntryExit({
                    payload: {
                        ...this.cvEntryExitControl,
                        cvType: this.cvType,
                    },
                }),
            );
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
