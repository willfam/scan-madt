import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, RouterOutlet } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { AppState } from '@store/app.state';
import { MqttService } from '@services/mqtt.service';
import { MsgSubID, MsgID, IAuth, TopicsKeys, LOCAL_STORAGE_KEY, IPopUpControl } from '@models';
import {
    updateFareConsole,
    updateBusIdInformation,
    updateExternalDevices,
    updateTestPrinter,
    updateViewParameter,
    updateAppUpgrade,
    updateVersionInfo,
} from '@store/maintenance/maintenance.reducer';
import { HeaderComponent } from '@components/layout/header/header.component';
import { ShuttingDownWarningComponent } from '@components/shutting-down-warning/shutting-down-warning.component';
import { Notification } from '@components/notification/notification.component';

import { LocalStorageService } from '@services/local-storage.service';

@Component({
    standalone: true,
    selector: 'maintenance-layout',
    imports: [CommonModule, TranslateModule, RouterOutlet, HeaderComponent, ShuttingDownWarningComponent, Notification],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
})
export class MaintenanceLayoutComponent implements OnInit {
    private destroy$ = new Subject<void>();
    private mqttSubscriptions: Array<{
        topic: string;
        topicKey: string;
    }> = []; // Track MQTT topics for cleanup

    // private auth$: <IAuth>;
    auth: IAuth = {
        isLoggedIn: false,
    };
    topics;

    shuttingDownWarning: IPopUpControl = { show: false };
    notification: IPopUpControl = { show: false, message: '' };

    constructor(
        protected router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
        private localStorageService: LocalStorageService,
    ) {
        // this.auth$ = this.store.select(auth);
    }

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
        let currentFareConsole = 0;
        let currentBusId = 0;
        let currentExternalDevices = 0;
        let currentTestPrinter = 0;
        let currentViewParameter = 0;
        let currentAppUpgrade = 0;
        let currentShuttingDownWarning = 0;
        let currentShowNotification = 0;

        this.mqttService.subscribe({
            topic: topics.maintenance?.response,
            topicKey: TopicsKeys.MAINTENANCE,
            callback: (message) => {
                const formatMess = JSON.parse(message);
                const { header, payload } = formatMess;
                // console.log('header?.msgID', header?.msgID);

                this.shuttingDownWarning = {
                    show: false,
                    message: '',
                };

                const dateTime = new Date(header?.dateTime);
                if (header?.msgSubID === MsgSubID?.NOTIFY) {
                    switch (header?.msgID) {
                        case MsgID.LOGIN_SUCCESS:
                            setTimeout(() => {
                                const authStr = this.localStorageService.getItem(LOCAL_STORAGE_KEY.AUTH);
                                if (authStr) {
                                    this.auth = JSON.parse(authStr);
                                }
                            }, 100);
                            break;
                        case MsgID.LOGOUT_SUCCESS:
                            this.auth = { isLoggedIn: false, loggedInType: undefined };
                            break;

                        case MsgID.IGNITION_OFF:
                            currentShuttingDownWarning = this.messValidation(
                                dateTime,
                                currentShuttingDownWarning,
                                () => {
                                    this.shuttingDownWarning = {
                                        show: true,
                                        message: payload?.currentTime || '',
                                    };
                                },
                            );
                            break;
                        case MsgID.MAINTENANCE_RESULT_NOTIFICATION:
                            currentShowNotification = this.messValidation(dateTime, currentShowNotification, () => {
                                this.notification = {
                                    show: true,
                                    message: payload?.message || '',
                                };
                            });
                            break;
                        default:
                            break;
                    }
                }

                if (header?.msgSubID === MsgSubID?.RESPONSE) {
                    switch (header?.msgID) {
                        case MsgID?.MAINTENANCE_FARE_CONSOLE:
                        case MsgID?.MAINTENANCE_DECK_TYPE_LIST:
                        case MsgID?.MAINTENANCE_DELETE_PARAMETER:
                            currentFareConsole = this.messValidation(dateTime, currentFareConsole, () => {
                                this.store.dispatch(
                                    updateFareConsole({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;
                        case MsgID.MAINTENANCE_BUS_ID:
                        case MsgID.MAINTENANCE_OPERATOR:
                        case MsgID.MAINTENANCE_BUS_ID_SUBMIT:
                            currentBusId = this.messValidation(dateTime, currentBusId, () => {
                                this.store.dispatch(
                                    updateBusIdInformation({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;

                        case MsgID?.MAINTENANCE_EXTERNAL_DEVICES:
                            currentExternalDevices = this.messValidation(dateTime, currentExternalDevices, () => {
                                this.store.dispatch(
                                    updateExternalDevices({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.MAINTENANCE_TEST_PRINT:
                            currentTestPrinter = this.messValidation(dateTime, currentTestPrinter, () => {
                                this.store.dispatch(
                                    updateTestPrinter({
                                        payload,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.MAINTENANCE_PARAMETER:
                            currentViewParameter = this.messValidation(dateTime, currentViewParameter, () => {
                                this.store.dispatch(
                                    updateViewParameter({
                                        payload,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.MAINTENANCE_APP_UPGRADE:
                        case MsgID?.MAINTENANCE_UPGRADE_SUBMIT:
                            currentAppUpgrade = this.messValidation(dateTime, currentAppUpgrade, () => {
                                this.store.dispatch(
                                    updateAppUpgrade({
                                        payload,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.MAINTENANCE_VERSION_INFO:
                            currentViewParameter = this.messValidation(dateTime, currentViewParameter, () => {
                                this.store.dispatch(
                                    updateVersionInfo({
                                        payload,
                                    }),
                                );
                            });
                            break;
                        case MsgID.IGNITION_OFF:
                            currentShuttingDownWarning = this.messValidation(
                                dateTime,
                                currentShuttingDownWarning,
                                () => {
                                    this.shuttingDownWarning = {
                                        show: false,
                                        message: '',
                                        disabled: false,
                                    };
                                },
                            );
                            break;
                        default:
                            break;
                    }
                }
            },
        });

        this.mqttSubscriptions.push({
            topic: topics.maintenance?.response,
            topicKey: TopicsKeys.MAINTENANCE,
        });
    }

    handleIgnitionOff() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.maintenance?.get,
            msgID: MsgID.IGNITION_OFF,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });

        this.shuttingDownWarning = {
            ...this.shuttingDownWarning,
            disabled: true,
        };
    }

    handleClosePopup() {
        this.notification = { show: false, message: '' };
    }

    ngOnDestroy() {
        // Trigger unsubscription from all s
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
