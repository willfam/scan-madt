import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { routerUrls } from '@app/app.routes';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { MqttService } from '@services/mqtt.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { IBreakDown, MsgID, MsgSubID, ResponseStatus, DEFAULT_TIMEOUT } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { breakDownInfo, updateBreakDownInfo } from '@store/main/main.reducer';
@Component({
    standalone: true,
    selector: 'breakdown',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        NgScrollbarModule,
        ConfirmDialogComponent,
        DialogComponent,
        TranslateModule,
    ],
    templateUrl: './breakdown.component.html',
    styleUrls: ['./breakdown.component.scss'],
})
export class BreakdownComponent implements OnInit {
    private destroy$ = new Subject<void>();

    MsgID = MsgID;
    ResponseStatus = ResponseStatus;

    breakDownInfo$: Observable<IBreakDown>;
    breakDownInfoData: IBreakDown = {
        service: 0,
        direction: '',
        busStopList: [],
        firstBusStop: {},
        lastBusStop: {},
        reasonList: [],
    };
    step: number;
    endTripType: string = '';
    dialogTitle: string = '';

    reason: number = 0;
    numOfComplimentaryTickets = 0;
    numOfBreakdownTickets = 0;

    selected: string = '';
    displayReason: boolean = false;

    selectedFirstBusStop;
    selectedLastBusStop;
    currentValueChange: string = '';

    topics;

    //implement timeout
    timeoutMessage;
    intervalId;

    constructor(
        private router: Router,
        private mqttService: MqttService,
        private store: Store<AppState>,
    ) {
        this.step = 1;
        this.breakDownInfo$ = this.store.select(breakDownInfo);
    }

    ngOnInit() {
        this.breakDownInfo$.pipe(takeUntil(this.destroy$)).subscribe((data: IBreakDown) => {
            this.breakDownInfoData = data || {};
            console.log('breakDownInfoData', this.breakDownInfoData);

            this.selectedFirstBusStop = this.breakDownInfoData.firstBusStop;
            this.selectedLastBusStop = this.breakDownInfoData.lastBusStop;

            if (
                (this.breakDownInfoData?.msgID === MsgID.BREAKDOWN_PROCESS_BREAKDOWN_TICKET ||
                    this.breakDownInfoData?.msgID === MsgID.BREAKDOWN_SUBMIT_WO_PRINT) &&
                this.breakDownInfoData?.status === ResponseStatus.SUCCESS
            ) {
                this.navigateToBusOperation();
            }
        });

        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });
    }

    backToMain() {
        this.resetBreakdownInfo();
        this.router.navigate([routerUrls?.private?.main?.busStopInformation]);
    }

    navigateToBusOperation() {
        this.router.navigate([routerUrls?.private?.main?.busOperation?.url]);
    }

    goBack(step: number) {
        this.step = step;
    }

    goBackAndReset(step: number) {
        this.resetBreakdownInfo();
        this.step = step;
    }

    handleConfirm(isConfirm: boolean) {
        if (isConfirm) {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.BREAKDOWN_TYPE,
                msgSubID: MsgSubID.REQUEST,
                payload: {},
            });
        } else {
            this.backToMain();
        }
    }

    handleChange(type: string) {
        this.step = 2;
        this.currentValueChange = type;

        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.BREAKDOWN_BUS_STOP_LIST,
            msgSubID: MsgSubID.REQUEST,
            payload: {
                serviceNumber: this.breakDownInfoData.service,
            },
        });
    }

    handleSelectBusStop(busStopId) {
        if (this.currentValueChange === 'first_bus_stop') {
            const nextFirstBusStop = this.breakDownInfoData.busStopList?.find((busStop) => busStop.Busid === busStopId);
            this.selectedFirstBusStop = nextFirstBusStop;
        } else if (this.currentValueChange === 'last_bus_stop') {
            const nextLastBusStop = this.breakDownInfoData.busStopList?.find((busStop) => busStop.Busid === busStopId);
            this.selectedLastBusStop = nextLastBusStop;
        }
    }

    handleUpdateBusStop() {
        this.step = 0;
        const nextEndTripInfo = { ...this.breakDownInfoData };
        this.store.dispatch(
            updateBreakDownInfo({
                payload: {
                    ...nextEndTripInfo,
                    firstBusStop: this.selectedFirstBusStop,
                    lastBusStop: this.selectedLastBusStop,
                },
                msgID: this.breakDownInfoData.msgID,
            }),
        );
    }

    handleConfirmValue() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.BREAKDOWN_SUBMIT,
            msgSubID: MsgSubID.REQUEST,
            payload: {
                service: this.breakDownInfoData.service,
                direction: this.breakDownInfoData.direction,
                firstBusStop: this.breakDownInfoData.firstBusStop.Busid,
                lastBusStop: this.breakDownInfoData.lastBusStop.Busid,
            },
        });
        // this.step = 0;
    }

    backToInformation() {
        this.store.dispatch(
            updateBreakDownInfo({
                payload: {
                    ...this.breakDownInfoData,
                },
                msgID: MsgID.BREAKDOWN_TYPE,
            }),
        );
        this.step = 0;
        this.reason = 0;
        this.numOfComplimentaryTickets = 0;
        this.numOfBreakdownTickets = 0;
    }

    handleSelectReason(reason: number) {
        this.reason = reason;
    }

    handleCloseReason() {
        this.reason = 0;
        this.displayReason = false;
    }

    handleConfirmReason() {
        if (!this.reason) {
            return;
        }
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.BREAKDOWN_SUBMIT_REASON,
            msgSubID: MsgSubID.REQUEST,
            payload: {
                reason: this.reason,
            },
        });
    }

    backToReason() {
        this.store.dispatch(
            updateBreakDownInfo({
                payload: {
                    ...this.breakDownInfoData,
                    status: ResponseStatus.SUCCESS,
                },
                msgID: MsgID.BREAKDOWN_SUBMIT,
            }),
        );
        this.numOfComplimentaryTickets = 0;
    }

    selectNumOfComplimentaryTicket(num: number) {
        this.numOfComplimentaryTickets = num;

        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.BREAKDOWN_SUBMIT_COMP_TICKET,
            msgSubID: MsgSubID.REQUEST,
            payload: {
                numOfCompTickets: Number(num),
            },
        });
    }

    printComplimentaryTicket() {
        // if (this.numOfComplimentaryTickets > 0) {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.BREAKDOWN_PROCESS_COMP_TICKET,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
        // }
    }

    backToComplimentaryTicket() {
        this.store.dispatch(
            updateBreakDownInfo({
                payload: {
                    ...this.breakDownInfoData,
                    status: ResponseStatus.SUCCESS,
                },
                msgID: MsgID.BREAKDOWN_SUBMIT_REASON,
            }),
        );
        this.numOfBreakdownTickets = 0;
    }

    selectNumOfBreakdownTicket(num: number) {
        this.numOfBreakdownTickets = num;

        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.BREAKDOWN_SUBMIT_BREAKDOWN_TICKET,
            msgSubID: MsgSubID.REQUEST,
            payload: {
                numOfBreakdownTickets: this.numOfBreakdownTickets,
            },
        });
    }

    printBreakdownTicket() {
        // if (this.numOfBreakdownTickets > 0) {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.BREAKDOWN_PROCESS_BREAKDOWN_TICKET,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
        // }
    }

    resetBreakdownInfo() {
        this.store.dispatch(
            updateBreakDownInfo({
                payload: {
                    status: 0,
                    title: '',
                    direction: '',
                    service: 0,
                    firstBusStop: {},
                    lastBusStop: {},
                    busStopList: [],
                    reasonList: [],
                },
                msgID: undefined,
            }),
        );
    }

    handleProceedWoPrint() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.BREAKDOWN_SUBMIT_WO_PRINT,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.resetBreakdownInfo();
    }
}
