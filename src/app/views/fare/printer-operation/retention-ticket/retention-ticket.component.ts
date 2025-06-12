import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { MsgID, MsgSubID, IRetentionTicket, ResponseStatus } from '@models';
import { AppState } from '@store/app.state';
import { retentionTicket, updateRetentionTicket } from '@store/fare/fare.reducer';

@Component({
    standalone: true,
    selector: 'retention-ticket',
    imports: [CommonModule, RouterModule, TranslateModule, ConfirmDialogComponent, CustomKeyboardComponent],
    templateUrl: './retention-ticket.component.html',
    styleUrls: ['./retention-ticket.component.scss'],
})
export class PrintRetentionTicket implements OnInit {
    private destroy$ = new Subject<void>();
    private retentionTicket$: Observable<IRetentionTicket>;
    retentionTicket: IRetentionTicket = {};

    step: number = 1;
    success: boolean = true;

    MsgID = MsgID;
    ResponseStatus = ResponseStatus;

    topics;

    constructor(
        private router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        this.retentionTicket$ = this.store.select(retentionTicket);
    }

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
                // this.mqttService.publishWithMessageFormat({
                //     topic: this.topics?.fareTab?.get,
                //     msgID: MsgID.FARE_SHOW_CV_STATUS,
                //     msgSubID: MsgSubID.REQUEST,
                //     payload: {},
                // });
            }
        });

        this.retentionTicket$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.retentionTicket = data;
            // console.log('retentionTicket', this.retentionTicket);
        });
    }

    goBack() {
        this.router.navigate(['/fare/printer-operation']);
    }

    handleSelectCV(cvNum: number) {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.fareTab?.get,
            msgID: MsgID.FARE_PRINT_RETENTION_TICKET1,
            msgSubID: MsgSubID.REQUEST,
            payload: { cvNum },
        });
        // this.step = 2;
    }

    handleDetectCart(isConfirm: boolean) {
        if (isConfirm) {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.fareTab?.get,
                msgID: MsgID.FARE_PRINT_RETENTION_TICKET2,
                msgSubID: MsgSubID.REQUEST,
                payload: {},
            });
        } else {
            this.store.dispatch(updateRetentionTicket({ payload: {} }));
        }
    }

    handleStopDetectCard() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.fareTab?.get,
            msgID: MsgID.FARE_PRINT_RETENTION_TICKET3,
            msgSubID: MsgSubID.NOTIFY,
            payload: {},
        });
        this.store.dispatch(
            updateRetentionTicket({
                payload: {
                    ...this.retentionTicket,
                    status: undefined,
                    message: undefined,
                },
                msgID: MsgID.FARE_PRINT_RETENTION_TICKET1,
            }),
        );
    }

    handlePrintRetention() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.fareTab?.get,
            msgID: MsgID.FARE_PRINT_RETENTION_TICKET4,
            msgSubID: MsgSubID.NOTIFY,
            payload: {},
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();

        updateRetentionTicket({
            payload: {
                cartAt: undefined,
                status: undefined,
                message: undefined,
                cardDetail: undefined,
            },
            msgID: undefined,
        });
    }
}
