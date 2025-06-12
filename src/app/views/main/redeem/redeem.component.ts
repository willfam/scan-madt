import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';

import { routerUrls } from '@app/app.routes';
import { MsgID, MsgSubID } from '@models';
import { MqttService } from '@services/mqtt.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
    standalone: true,
    selector: 'redeem',
    imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './redeem.component.html',
    styleUrls: ['./redeem.component.scss'],
})
export class RedeemComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    cvMode: string = '';
    topics;

    constructor(
        private router: Router,
        private mqttService: MqttService,
    ) {}

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });
    }

    backToMain(): void {
        this.router.navigate([routerUrls?.private?.main?.busStopInformation]);
    }

    handleRedeem(isConfirm: boolean) {
        if (isConfirm) {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.MAIN_REDEEM_SUBMIT,
                msgSubID: MsgSubID.NOTIFY,
                payload: {},
            });
        } else {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.MAIN_REDEEM_CANCEL,
                msgSubID: MsgSubID.NOTIFY,
                payload: {},
            });
            this.backToMain();
        }
    }

    ngOnDestroy() {
        // Emit to destroy all active subscriptions
        this.destroy$.next();
        this.destroy$.complete();
    }
}
