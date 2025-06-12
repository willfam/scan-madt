import { Component, OnInit } from '@angular/core';
import { routerUrls } from '@app/app.routes';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IStartTrip, StartTripTypes, MsgID, MsgSubID } from '@models';
import { MqttService } from '@services/mqtt.service';
import { AppState } from '@store/app.state';
import { startTrip } from '@store/main/main.reducer';

@Component({
    selector: 'app-start-trip-details-issue',
    standalone: true,
    imports: [RouterModule, TranslateModule, CommonModule],
    templateUrl: './start-trip-details-issue.component.html',
    styleUrl: './start-trip-details-issue.component.scss',
})
export class StartTripDetailsIssueComponent implements OnInit {
    // tripTypeDetails = StartTripTypes;

    private destroy$ = new Subject<void>();
    // private startTrip$: Observable<IStartTrip> = this.store.select(startTrip);
    // startTripData: IStartTrip = {
    //     type: this.tripTypeDetails.FMS_NO_INFO,
    // };

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

        // this.startTrip$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
        //     this.startTripData = data;
        // });
    }

    backToBusOperation() {
        this.mqttService?.publishWithMessageFormat({
            topic: this.topics.mainTab?.get,
            msgID: MsgID?.START_TRIP_CANCEL_FLOW,
            msgSubID: MsgSubID?.NOTIFY,
        });
        this.router.navigate([routerUrls?.private?.main?.busOperation?.url]);
    }

    handleSettingTrip() {
        this.mqttService?.publishWithMessageFormat({
            topic: this.topics.mainTab?.get,
            msgID: MsgID?.START_TRIP_SELECT_FARE_DETAIL_BTN,
            msgSubID: MsgSubID?.NOTIFY,
        });
        // this.router.navigate([routerUrls?.private?.main?.busOperation?.startTripValidInfo]);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
