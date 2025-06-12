import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, RouterOutlet } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from '@components/layout/header/header.component';
import { AppState } from '@store/app.state';
import { MqttService } from '@services/mqtt.service';
import { MsgSubID, MsgID, IAuth, TopicsKeys, LOCAL_STORAGE_KEY, IPopUpControl } from '@models';
import {
    updateCancelRideCV1,
    updateCancelRideCV2,
    updateConcessionCV1,
    updateConcessionCV2,
    updateCVEntryExit,
    updateCVModeControl,
    updateCVPowerControl,
    updatePrintStatus,
    updateRetentionTicket,
    updateShowCVStatus,
} from '@store/fare/fare.reducer';
import { isOnTrip } from '@store/global/global.reducer';
import { LocalStorageService } from '@services/local-storage.service';

import { BusOffRouteComponent } from '@components/bus-off-route/bus-off-route.component';
import { AutoDisableBlsComponent } from '@components/auto-disable-bls/auto-disable-bls.component';

@Component({
    standalone: true,
    selector: 'fare-layout',
    imports: [
        CommonModule,
        RouterOutlet,
        TranslateModule,
        HeaderComponent,
        BusOffRouteComponent,
        AutoDisableBlsComponent,
    ],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
})
export class FareLayoutComponent implements OnInit {
    private destroy$ = new Subject<void>();
    private mqttSubscriptions: Array<{
        topic: string;
        topicKey: string;
    }> = []; // Track MQTT topics for cleanup

    auth: IAuth = {
        isLoggedIn: false,
    };

    isOnTrip: boolean = false;
    isOnTrip$ = this.store.select(isOnTrip);

    topics;

    busOffRoute: IPopUpControl = { show: false };
    disableBls: IPopUpControl = { show: false };
    constructor(
        protected router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
        private localStorageService: LocalStorageService,
    ) {}

    ngOnInit() {
        this.mqttService.connectionStatus$.pipe(takeUntil(this.destroy$)).subscribe((isConnected) => {
            if (isConnected) {
                this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
                    if (configLoaded) {
                        const topics = this.mqttService.mqttConfig?.topics;
                        this.topics = topics;
                        if (topics) {
                            this.validatedAuth(topics);
                        }
                    }
                });
            }
        });

        const authStr = this.localStorageService.getItem(LOCAL_STORAGE_KEY.AUTH);
        if (authStr) {
            this.auth = JSON.parse(authStr);
        }

        this.isOnTrip$.pipe(takeUntil(this.destroy$)).subscribe((isOnTrip) => {
            this.isOnTrip = isOnTrip;
        });
    }

    navigate(route: string): void {
        this.router.navigate([`/${route}`]);
    }

    messValidation(timeStamp, currentMainPAgeMess, callback) {
        let currentMess = 0;
        if (timeStamp >= currentMainPAgeMess) {
            callback();
            // this.loading = false;
            currentMess = timeStamp;
        }
        return currentMess;
    }

    validatedAuth(topics) {
        let currentCvStatus = 0;
        let currentCVPowerCtrl = 0;
        let currentCVEXitEntry = 0;
        let currentCVModeCtrl = 0;
        let currentRetentionTicket = 0;
        let currentPrintStatus = 0;
        let currentBusOffRoute = 0;
        let currentDisableBls = 0;
        let currentCancelRideCV1 = 0;
        let currentCancelRideCV2 = 0;
        let currentConcessionCV1 = 0;
        let currentConcessionCV2 = 0;

        this.mqttService.subscribe({
            topic: topics.fareTab?.response,
            topicKey: TopicsKeys.FARE_TAB,
            callback: (message) => {
                const formatMess = JSON.parse(message);
                const { header, payload } = formatMess;
                // console.log('header?.msgID', header?.msgID);
                const dateTime = new Date(header?.dateTime);
                if (header?.msgSubID === MsgSubID?.NOTIFY) {
                    switch (header?.msgID) {
                        case MsgID.LOGIN_SUCCESS:
                            setTimeout(() => {
                                const authStr = this.localStorageService.getItem(LOCAL_STORAGE_KEY.AUTH);
                                if (authStr) {
                                    this.auth = JSON.parse(authStr);
                                }
                            });
                            break;
                        case MsgID.LOGOUT_SUCCESS:
                            this.auth = { isLoggedIn: false, loggedInType: undefined };
                            break;
                        case MsgID.START_TRIP_SUCCESS:
                            this.isOnTrip = true;
                            break;
                        case MsgID.END_TRIP_SUCCESS:
                            this.isOnTrip = false;
                            break;
                        case MsgID.BUS_OFF_ROUTE:
                            currentBusOffRoute = this.messValidation(dateTime, currentBusOffRoute, () => {
                                this.busOffRoute = {
                                    show: true,
                                };
                            });
                            break;
                        case MsgID.AUTO_DISABLE_BLS:
                            currentDisableBls = this.messValidation(dateTime, currentDisableBls, () => {
                                this.disableBls = {
                                    show: true,
                                };
                            });
                            break;
                        default:
                            break;
                    }
                }

                if (header?.msgSubID === MsgSubID?.RESPONSE) {
                    switch (header?.msgID) {
                        case MsgID?.FARE_SHOW_CV_STATUS:
                            currentCvStatus = this.messValidation(dateTime, currentCvStatus, () => {
                                this.store.dispatch(
                                    updateShowCVStatus({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.FARE_CV_POWER_CTRL:
                            currentCVPowerCtrl = this.messValidation(dateTime, currentCVPowerCtrl, () => {
                                this.store.dispatch(
                                    updateCVPowerControl({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.FARE_SET_CV_ENTRY_EXIT:
                            currentCVEXitEntry = this.messValidation(dateTime, currentCVEXitEntry, () => {
                                this.store.dispatch(
                                    updateCVEntryExit({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.FARE_CV_MODE_CONTROL:
                            currentCVModeCtrl = this.messValidation(dateTime, currentCVModeCtrl, () => {
                                this.store.dispatch(
                                    updateCVModeControl({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;

                        case MsgID?.FARE_PRINT_RETENTION_TICKET1:
                        case MsgID?.FARE_PRINT_RETENTION_TICKET2:
                            currentRetentionTicket = this.messValidation(dateTime, currentRetentionTicket, () => {
                                this.store.dispatch(
                                    updateRetentionTicket({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.FARE_PRINTER_STATUS:
                            currentPrintStatus = this.messValidation(dateTime, currentPrintStatus, () => {
                                this.store.dispatch(
                                    updatePrintStatus({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.FARE_CANCEL_RIDE_CV1_SUBMIT:
                            currentCancelRideCV1 = this.messValidation(dateTime, currentCancelRideCV1, () => {
                                this.store.dispatch(
                                    updateCancelRideCV1({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.FARE_CANCEL_RIDE_CV2_SUBMIT:
                            currentCancelRideCV2 = this.messValidation(dateTime, currentCancelRideCV2, () => {
                                this.store.dispatch(
                                    updateCancelRideCV2({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;

                        case MsgID?.FARE_CONCESSION_CV1_SUBMIT:
                            currentConcessionCV1 = this.messValidation(dateTime, currentConcessionCV1, () => {
                                this.store.dispatch(
                                    updateConcessionCV1({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.FARE_CONCESSION_CV2_SUBMIT:
                            currentConcessionCV2 = this.messValidation(dateTime, currentConcessionCV2, () => {
                                this.store.dispatch(
                                    updateConcessionCV2({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;

                        default:
                            break;
                    }
                }
            },
        });
        this.mqttSubscriptions.push({
            topic: topics.fareTab?.response,
            topicKey: TopicsKeys.FARE_TAB,
        });
    }

    handleTurnOffBusOfRoute() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.fareTab?.get,
            msgID: MsgID.BUS_OFF_ROUTE,
            msgSubID: MsgSubID.NOTIFY,
            payload: {},
        });

        this.busOffRoute = {
            show: false,
        };
    }

    handleConfirmDisableBls(isConfirm: boolean) {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.fareTab?.get,
            msgID: MsgID.AUTO_DISABLE_BLS,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                disable: isConfirm,
            },
        });

        this.disableBls = {
            show: false,
        };
    }

    ngOnDestroy() {
        // Trigger unsubscription from all observables
        this.destroy$.next();
        this.destroy$.complete();

        // Unsubscribe from all MQTT topics using the unsubscribe method from MqttService
        if (this.mqttSubscriptions?.length > 0) {
            this.mqttSubscriptions.forEach((topic) => {
                this.mqttService.unsubscribe(topic?.topic, topic?.topicKey);
            });
        }
    }
}
