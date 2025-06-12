import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { HeaderComponent } from '@components/layout/header/header.component';
import { MqttService } from '@services/mqtt.service';
import { MsgSubID, MsgID, IAuth, TopicsKeys, LOCAL_STORAGE_KEY, IPopUpControl } from '@models';

@Component({
    standalone: true,
    selector: 'app-maintenance',
    imports: [CommonModule, TranslateModule, HeaderComponent],
    templateUrl: './maintenance-menu.component.html',
    styleUrls: ['./maintenance-menu.component.scss'],
})
export class MaintenanceMenuComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
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

    buttons = [
        {
            title: 'FARE_SYSTEM',
            icon: '/assets/images/icons/maintenance/fare.svg',
            link: '/maintenance/fare',
            onClick: (link: string) => {
                this.navigate(link);
            },
        },
        {
            title: 'FMS',
            icon: '/assets/images/icons/maintenance/fms.svg',
            link: '/maintenance/fms',
            onClick: (link: string) => {
                this.mqttService?.publishWithMessageFormat({
                    topic: this.topics?.maintenance?.get,
                    msgID: MsgID.MAINTENANCE_FMS,
                    msgSubID: MsgSubID.NOTIFY,
                    payload: {},
                });
            },
        },
        {
            title: 'CJB',
            icon: '/assets/images/icons/maintenance/cjb.svg',
            link: '/maintenance/cjb',
            onClick: (link: string) => {
                this.navigate(link);
            },
        },
    ];

    navigate(link: string) {
        this.router.navigate([link]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
