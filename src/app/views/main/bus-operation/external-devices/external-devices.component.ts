import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TranslateModule } from '@ngx-translate/core';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { IExternalDevice, MsgID, MsgSubID, ResponseStatus } from '@models';
import { AppState } from '@store/app.state';
import { externalDevices } from '@store/main/main.reducer';

@Component({
    standalone: true,
    selector: 'external-devices',
    imports: [CommonModule, MatIconModule, NgScrollbarModule, RouterModule, TranslateModule],
    templateUrl: './external-devices.component.html',
    styleUrls: ['./external-devices.component.scss'],
})
export class ExternalDevicesComponent implements OnInit {
    private destroy$ = new Subject<void>();
    MsgID = MsgID;
    ResponseStatus = ResponseStatus;

    private externalDevices$: Observable<IExternalDevice>;
    externalDevices: IExternalDevice = {
        testPrinter: {
            status: 0,
            message: '',
        },
        printer: {
            status: 4,
            message: '',
        },
        fare: {
            status: 4,
            message: '',
        },
        transmitter: {
            status: 4,
            message: '',
        },
        cv1: {
            status: 4,
            message: '',
        },
        cv2: {
            status: 4,
            message: '',
        },
        cv3: {
            status: 4,
            message: '',
        },
        cv4: {
            status: 4,
            message: '',
        },
        cv5: {
            status: 4,
            message: '',
        },
        cv6: {
            status: 4,
            message: '',
        },
    };

    topics;

    constructor(
        private router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        this.externalDevices$ = this.store.select(externalDevices);
    }

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
                this.mqttService.publishWithMessageFormat({
                    topic: this.topics?.mainTab?.get,
                    msgID: MsgID.EXTERNAL_DEVICES,
                    msgSubID: MsgSubID.REQUEST,
                    payload: {},
                });
            }
        });

        this.externalDevices$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.externalDevices = data;
            // console.log({ externalDevices: this.externalDevices });
        });
    }

    handlePrintTest() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.TEST_PRINT,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
    }

    handleRefresh() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.EXTERNAL_DEVICES,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
    }

    handleConfirm(isConfirm: boolean) {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: isConfirm ? MsgID.EXT_DEVICE_SUBMIT : MsgID.EXT_DEVICE_CANCEL,
            msgSubID: MsgSubID.NOTIFY,
            payload: {},
        });

        this.backToStartShift();
    }

    backToStartShift() {
        this.router.navigate(['/main/bus-operation']);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
