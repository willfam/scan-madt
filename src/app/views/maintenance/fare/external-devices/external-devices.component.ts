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
import { externalDevices, updateExternalDevices } from '@store/maintenance/maintenance.reducer';

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
                    topic: this.topics?.maintenance?.get,
                    msgID: MsgID.MAINTENANCE_EXTERNAL_DEVICES,
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
            topic: this.topics?.maintenance?.get,
            msgID: MsgID.MAINTENANCE_TEST_PRINT,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
    }

    handleRefresh() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.maintenance?.get,
            msgID: MsgID.MAINTENANCE_EXTERNAL_DEVICES,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
    }

    handleConfirm(isConfirm: boolean) {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.maintenance?.get,
            msgID: isConfirm ? MsgID.MAINTENANCE_EXT_DEVICE_SUBMIT : MsgID.MAINTENANCE_EXT_DEVICE_CANCEL,
            msgSubID: MsgSubID.NOTIFY,
            payload: {},
        });

        this.backToFareConsole();
    }

    backToFareConsole() {
        this.router.navigate(['/maintenance/fare/fare-console']);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();

        this.store.dispatch(
            updateExternalDevices({
                payload: {
                    msgID: undefined,
                    status: undefined,
                    message: undefined,
                    testPrinter: {
                        status: 0,
                        message: '',
                    },
                    printer: {
                        status: 0,
                        message: '',
                    },
                    fare: {
                        status: 0,
                        message: '',
                    },
                    transmitter: {
                        status: 0,
                        message: '',
                    },
                    cv1: {
                        status: 0,
                        message: '',
                    },
                    cv2: {
                        status: 0,
                        message: '',
                    },
                    cv3: {
                        status: 0,
                        message: '',
                    },
                    cv4: {
                        status: 0,
                        message: '',
                    },
                    cv5: {
                        status: 0,
                        message: '',
                    },
                    cv6: {
                        status: 0,
                        message: '',
                    },
                },
                msgID: undefined,
            }),
        );
    }
}
