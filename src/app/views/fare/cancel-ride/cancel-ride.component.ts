import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ICancelRide, MsgID, MsgSubID, ResponseStatus } from '@models';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { AppState } from '@store/app.state';
import { cancelRideCV1, cancelRideCV2, updateCancelRideCV1, updateCancelRideCV2 } from '@store/fare/fare.reducer';

@Component({
    standalone: true,
    selector: 'cancel-ride',
    imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './cancel-ride.component.html',
    styleUrls: ['./cancel-ride.component.scss'],
})
export class CancelRideComponent implements OnInit, OnDestroy {
    msgID = MsgID;
    ResponseStatus = ResponseStatus;
    cv: 'CV1' | 'CV2' = 'CV1';

    private destroy$ = new Subject<void>();
    private cancelRide$: Observable<ICancelRide>;
    cancelRide: ICancelRide = {};
    topics;

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        const pageData = this.activeRoute.snapshot.data;
        this.cv = pageData['cvType'] as 'CV1' | 'CV2';
        this.cancelRide$ = this.store.select(this.cv === 'CV1' ? cancelRideCV1 : cancelRideCV2);
    }

    ngOnInit(): void {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
                // this.mqttService.publishWithMessageFormat({
                //     topic: this.topics?.fareTab?.get,
                //     msgID: MsgID[`FARE_CANCEL_RIDE_${this.cv}`],
                //     msgSubID: MsgSubID.REQUEST,
                //     payload: {},
                // });
            }
        });

        this.cancelRide$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.cancelRide = data;
        });
    }

    handleCancelRide() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.fareTab?.get,
            msgID: MsgID[`FARE_CANCEL_RIDE_${this.cv}_CANCEL`],
            msgSubID: MsgSubID.NOTIFY,
            payload: {},
        });
        this.backToFare();
    }

    handleConfirmCancelRide() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.fareTab?.get,
            msgID: MsgID[`FARE_CANCEL_RIDE_${this.cv}_SUBMIT`],
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
    }

    handleStopCancelRide() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.fareTab?.get,
            msgID: MsgID[`FARE_CANCEL_RIDE_${this.cv}_CANCEL2`],
            msgSubID: MsgSubID.NOTIFY,
            payload: {},
        });

        this.store.dispatch(
            this.cv === 'CV1'
                ? updateCancelRideCV1({ payload: { status: undefined } })
                : updateCancelRideCV2({ payload: { status: undefined } }),
        );
    }

    backToFare() {
        this.router.navigate(['/fare']);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();

        this.store.dispatch(
            this.cv === 'CV1'
                ? updateCancelRideCV1({ payload: { status: undefined } })
                : updateCancelRideCV2({ payload: { status: undefined } }),
        );
    }
}
