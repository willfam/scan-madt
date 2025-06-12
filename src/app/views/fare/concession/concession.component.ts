import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IConcession, MsgID, MsgSubID, ResponseStatus } from '@models';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { AppState } from '@store/app.state';
import { concessionCV1, concessionCV2, updateConcessionCV1, updateConcessionCV2 } from '@store/fare/fare.reducer';

@Component({
    standalone: true,
    selector: 'concession',
    imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './concession.component.html',
    styleUrls: ['./concession.component.scss'],
})
export class ConcessionComponent implements OnInit, OnDestroy {
    msgID = MsgID;
    ResponseStatus = ResponseStatus;
    cv: 'CV1' | 'CV2' = 'CV1';

    private destroy$ = new Subject<void>();
    private concession$: Observable<IConcession>;
    concession: IConcession = {};
    topics;

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        const pageData = this.activeRoute.snapshot.data;
        this.cv = pageData['cvType'] as 'CV1' | 'CV2';
        this.concession$ = this.store.select(this.cv === 'CV1' ? concessionCV1 : concessionCV2);
    }

    ngOnInit(): void {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
                // this.mqttService.publishWithMessageFormat({
                //     topic: this.topics?.fareTab?.get,
                //     msgID: MsgID[`FARE_CONCESSION_${this.cv}`],
                //     msgSubID: MsgSubID.REQUEST,
                //     payload: {},
                // });
            }
        });

        this.concession$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.concession = data;
        });
    }

    handleConcession() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.fareTab?.get,
            msgID: MsgID[`FARE_CONCESSION_${this.cv}_CANCEL`],
            msgSubID: MsgSubID.NOTIFY,
            payload: {},
        });
        this.backToFare();
    }

    handleConfirmConcession() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.fareTab?.get,
            msgID: MsgID[`FARE_CONCESSION_${this.cv}_SUBMIT`],
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
    }

    handleStopConcession() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.fareTab?.get,
            msgID: MsgID[`FARE_CONCESSION_${this.cv}_CANCEL2`],
            msgSubID: MsgSubID.NOTIFY,
            payload: {},
        });

        this.store.dispatch(
            this.cv === 'CV1'
                ? updateConcessionCV1({ payload: { status: undefined } })
                : updateConcessionCV2({ payload: { status: undefined } }),
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
                ? updateConcessionCV1({ payload: { status: undefined } })
                : updateConcessionCV2({ payload: { status: undefined } }),
        );
    }
}
