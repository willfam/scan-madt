import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterOutlet } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { MsgID, MsgSubID } from '@models';
import { AppState } from '@store/app.state';

@Component({
    standalone: true,
    selector: 'fare-console-layout',
    imports: [CommonModule, MatIconModule, RouterModule, RouterOutlet],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
})
export class FareConsoleLayoutComponent implements OnInit {
    private destroy$ = new Subject<void>();

    topics;

    constructor(
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {}

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
                this.mqttService.publishWithMessageFormat({
                    topic: this.topics?.maintenance?.get,
                    msgID: MsgID.MAINTENANCE_FARE_CONSOLE,
                    msgSubID: MsgSubID.REQUEST,
                    payload: {},
                });
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
