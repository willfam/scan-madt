import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { MqttService } from '@services/mqtt.service';
import { SafeJsonService } from '@services/safe-json.service';
import { IBlsInformation, maintenanceDataType } from '@models';

@Component({
    standalone: true,
    selector: 'bls-information',
    imports: [CommonModule, MatIconModule, RouterModule, NgScrollbarModule, TranslateModule],
    templateUrl: './bls-information.component.html',
    styleUrls: ['./bls-information.component.scss'],
})
export class BLSInformationComponent implements OnInit {
    sort = {
        name: 'asc',
        status: 'asc',
    };

    blsList: IBlsInformation[] = [];

    // blsList = [
    //     { name: 'BLS_VER', status: '01.79.07' },
    //     { name: 'LONGITUDE', status: '0000000000' },
    //     { name: 'LATITUDE', status: '0000000000' },
    //     { name: 'BLS_CALIBRATOR_FACTOR', status: '457' },
    //     { name: 'ODOMETER_READING', status: '11132m' },
    //     { name: 'ODOMETER', status: 'NOT_CALIBRATED' },
    //     { name: 'GPS_ANTENNA', status: 'FAULT' },
    //     { name: 'NO_OF_DOORS', status: '2' },
    //     { name: 'AUTO_LOC', status: 'ENABLE' },
    //     { name: 'DR_CALIBRATION', status: 'NOT_CALIBRATED' },
    //     { name: 'TEMPERATURE', status: 'N_A' },
    //     { name: 'GYRO_SWITCH', status: 'FIXED' },
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
                                    this.blsList = data;
                                },
                            });
                            this.mqttService.publish(
                                topics.maintenance?.get,
                                JSON.stringify({ dataType: maintenanceDataType.BLS_INFORMATION }),
                            );

                            this.mqttSubscriptions.push(topics.maintenance.get, topics.maintenance.response);
                        }
                    }
                });
            }
        });
    }

    handleSort(key: string): void {
        this.sort[key] = this.sort[key] === 'asc' ? 'desc' : 'asc';
        this.blsList.sort((a, b) => {
            const key1 = a[key].toUpperCase();
            const key2 = b[key].toUpperCase();
            const sortResult = key1.localeCompare(key2, undefined, { numeric: true, sensitivity: 'base' });
            return this.sort[key] === 'asc' ? sortResult : sortResult * -1;
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
