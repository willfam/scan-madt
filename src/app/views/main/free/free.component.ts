import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { freeMode, updateFreeCVs } from '@app/store/main/main.reducer';
import { routerUrls } from '@app/app.routes';

import { MsgID, MsgSubID } from '@models';
import { MqttService } from '@services/mqtt.service';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'free',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './free.component.html',
    styleUrls: ['./free.component.scss'],
})
export class FreeComponent implements OnDestroy, OnInit {
    private destroy$ = new Subject<void>();
    freeMode$: Observable<boolean> = this.store.select(freeMode);
    freeMode: boolean = false;

    topics;

    constructor(
        private router: Router,
        private mqttService: MqttService,
        private translate: TranslateService,
        private store: Store<AppState>,
    ) {}

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });

        this.freeMode$.pipe(takeUntil(this.destroy$)).subscribe((data: boolean) => {
            this.freeMode = data;
        });
    }

    backToMain(): void {
        this.router.navigate([routerUrls?.private?.main?.busStopInformation]);
    }

    handleFreeRideMode(): void {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.MAIN_FREE_SUBMIT,
            msgSubID: MsgSubID.REQUEST,
            payload: {
                freeMode: !this.freeMode,
            },
        });
    }

    ngOnDestroy() {
        // Emit to destroy all active subscriptions
        this.destroy$.next();
        this.destroy$.complete();
    }
}
