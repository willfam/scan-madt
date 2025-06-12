import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { IShowCVStatus, MsgID, MsgSubID, FareCVStatus, FareCVSubStatus } from '@models';
import { AppState } from '@store/app.state';
import { showCVStatus } from '@store/fare/fare.reducer';

@Component({
    standalone: true,
    selector: 'show-cv-status',
    imports: [CommonModule, TranslateModule, NgScrollbarModule, RouterModule],
    templateUrl: './show-cv-status.component.html',
    styleUrls: ['./show-cv-status.component.scss'],
})
export class ShowCVStatusComponent implements OnInit {
    private destroy$ = new Subject<void>();

    private cvsStatus$: Observable<IShowCVStatus>;
    showCVStatus: IShowCVStatus = {
        cvStatus: [],
    };

    topics;
    FareCVStatus = FareCVStatus;
    FareCVSubStatus = FareCVSubStatus;

    constructor(
        private router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        this.cvsStatus$ = this.store.select(showCVStatus);
    }

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
                this.mqttService.publishWithMessageFormat({
                    topic: this.topics?.fareTab?.get,
                    msgID: MsgID.FARE_SHOW_CV_STATUS,
                    msgSubID: MsgSubID.REQUEST,
                    payload: {},
                });
            }
        });

        this.cvsStatus$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.showCVStatus = data;
        });
    }

    goBack() {
        this.router.navigate(['/fare/cv-operation']);
    }

    handleClose() {
        this.goBack();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
