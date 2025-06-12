import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TranslateModule } from '@ngx-translate/core';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { IVersionInfo, MsgID, MsgSubID, ResponseStatus } from '@models';
import { AppState } from '@store/app.state';
import { versionInfo, updateVersionInfo } from '@store/maintenance/maintenance.reducer';

@Component({
    standalone: true,
    selector: 'version-info',
    imports: [CommonModule, MatIconModule, RouterModule, NgScrollbarModule, TranslateModule],
    templateUrl: './version-info.component.html',
    styleUrls: ['./version-info.component.scss'],
})
export class VersionInfoComponent implements OnInit {
    private destroy$ = new Subject<void>();
    private versionInfo$: Observable<IVersionInfo>;
    versionInfo: IVersionInfo = {
        versionInfoList: [],
    };

    isLoading: boolean = true;
    ResponseStatus = ResponseStatus;
    topics;

    constructor(
        private router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        this.versionInfo$ = this.store.select(versionInfo);
    }
    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
                this.mqttService.publishWithMessageFormat({
                    topic: this.topics?.maintenance?.get,
                    msgID: MsgID.MAINTENANCE_VERSION_INFO,
                    msgSubID: MsgSubID.REQUEST,
                    payload: {},
                });
            }
        });

        this.versionInfo$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.versionInfo = data;
            if (data && data?.versionInfoList?.length) {
                this.isLoading = false;
            } else if (data.status === ResponseStatus.PROGRESS) {
                this.isLoading = true;
            } else if (data.status === ResponseStatus.ERROR) {
                this.isLoading = false;
            }
        });
    }

    handleSort(key: string): void {
        // this.sort[key] = this.sort[key] === 'asc' ? 'desc' : 'asc';
        // this.versionInfoList.sort((a, b) => {
        //     const key1 = a[key].toUpperCase();
        //     const key2 = b[key].toUpperCase();
        //     const sortResult = key1.localeCompare(key2, undefined, { numeric: true, sensitivity: 'base' });
        //     return this.sort[key] === 'asc' ? sortResult : sortResult * -1;
        // });
    }

    handleRetry(): void {
        this.isLoading = true;
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.maintenance?.get,
            msgID: MsgID.MAINTENANCE_VERSION_INFO,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
