import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AppState } from '@store/app.state';
import { MqttService } from '@services/mqtt.service';
import { MsgSubID, MsgID } from '@models';

@Component({
    standalone: true,
    selector: 'printer-operation-menu',
    imports: [CommonModule, TranslateModule],
    templateUrl: './printer-operation-menu.component.html',
    styleUrls: ['./printer-operation-menu.component.scss'],
})
export class PrinterOperationMenuComponent implements OnInit {
    urlPrefix = '/fare/printer-operation';
    private destroy$ = new Subject<void>();
    MsgID = MsgID;

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
                // this.mqttService.publishWithMessageFormat({
                //     topic: this.topics?.fareTab?.get,
                //     msgID: MsgID.FARE_SHOW_CV_STATUS,
                //     msgSubID: MsgSubID.REQUEST,
                //     payload: {},
                // });
            }
        });
    }

    goBack() {
        this.router.navigate(['/fare']);
    }

    handleSendNotify(url: string, msgID: number, value?: boolean) {
        const payload = {};
        if (value !== undefined) {
            payload['status'] = value;
        }
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.fareTab?.get,
            msgID,
            msgSubID: MsgSubID.NOTIFY,
            payload,
        });
        console.log('handleSendNotify', url);
        if (url !== '') this.router.navigate([this.urlPrefix + url]);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
