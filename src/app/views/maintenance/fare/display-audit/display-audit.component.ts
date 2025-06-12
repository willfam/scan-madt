import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, Subject, takeUntil } from 'rxjs';

import { MqttService } from '@services/mqtt.service';
import { SafeJsonService } from '@services/safe-json.service';
import { IDisplayAudit, maintenanceDataType } from '@models';

@Component({
    standalone: true,
    selector: 'display-audit',
    imports: [CommonModule, MatIconModule, RouterModule, ReactiveFormsModule, TranslateModule],
    templateUrl: './display-audit.component.html',
    styleUrls: ['./display-audit.component.scss'],
})
export class DisplayAuditComponent implements OnInit {
    auditRegistrationList: IDisplayAudit[] = [];
    // auditRegistrationList = [
    //     { name: 'NUMBER_OF_CASH_TXN', value: 0 },
    //     { name: 'TOTAL_CASH', value: 0 },
    //     { name: 'NUMBER_OF_BUS_TRIPS', value: 0 },
    //     { name: 'NUMBER_OF_BUS_BREAKDOWN', value: 0 },
    //     { name: 'OUT_OF_SERVICES', value: 0 },
    //     { name: 'NUMBER_OF_CLOCK_DRIFT', value: 0 },
    //     { name: 'NUMBER_OF_STORAGE_FULL', value: 0 },
    // ];

    private mqttSubscriptions: string[] = [];
    private destroy$ = new Subject<void>();

    constructor(
        private mqttService: MqttService,
        private safeJsonService: SafeJsonService,
    ) {}

    ngOnInit() {
        this.mqttService.connectionStatus$.pipe(takeUntil(this.destroy$)).subscribe((isConnected) => {
            if (isConnected) {
                this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
                    if (configLoaded) {
                        const topics = this.mqttService.mqttConfig?.topics;
                        if (topics) {
                            this.mqttService.subscribe({
                                topic: topics?.maintenance?.response,
                                callback: (message) => {
                                    const data = this.safeJsonService.safeParse(message);
                                    this.auditRegistrationList = data;
                                },
                            });
                            this.mqttService.publish(
                                topics.maintenance?.get,
                                JSON.stringify({ dataType: maintenanceDataType.DISPLAY_AUDIT }),
                            );

                            this.mqttSubscriptions.push(topics.maintenance.get, topics.maintenance.response);
                        }
                    }
                });
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();

        // Unsubscribe from all MQTT topics using the unsubscribe method from MqttService
        this.mqttSubscriptions.forEach((topic) => {
            this.mqttService.unsubscribe(topic);
        });
    }
}
