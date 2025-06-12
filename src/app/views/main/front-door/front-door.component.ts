import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { routerUrls } from '@app/app.routes';
import { updateActiveCVs } from '@app/store/main/main.reducer';
import { MsgID, MsgSubID } from '@models';
import { MqttService } from '@services/mqtt.service';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'front-door',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './front-door.component.html',
    styleUrls: ['./front-door.component.scss'],
})
export class FrontDoorComponent implements OnDestroy, OnInit {
    private destroy$ = new Subject<void>();
    cvMode: string = '';
    topics;

    constructor(
        private router: Router,
        private store: Store<AppState>,
        private mqttService: MqttService,
    ) {}

    ngOnInit(): void {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });
    }

    backToMain(): void {
        this.router.navigate([routerUrls?.private?.main?.busStopInformation]);
    }

    handleChangeCvMode(cvMode: string): void {
        this.cvMode = cvMode;
    }

    handleCancel(): void {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.MAIN_FRONT_DOOR_CANCEL,
            msgSubID: MsgSubID.NOTIFY,
            payload: {},
        });
        this.backToMain();
    }

    handleUpdateCV(): void {
        const msgID = this.cvMode === 'CV1' ? MsgID.MAIN_FRONT_DOOR_CV1 : MsgID.MAIN_FRONT_DOOR_CV2;
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
    }

    ngOnDestroy() {
        // Emit to destroy all active subscriptions
        this.destroy$.next();
        this.destroy$.complete();
    }
}
