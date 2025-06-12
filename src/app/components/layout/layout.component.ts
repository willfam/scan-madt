import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { MqttService } from '@services/mqtt.service';
import { Subscription } from 'rxjs';
import { DummyInitService } from '@dummyData/init-dummy-data';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { SafeJsonService } from '@app/services/safe-json.service';
import { LocalStorageService } from '@services/local-storage.service';
import { AppState } from '@store/app.state';
import { updateConnectionStatus } from '@store/connection-status/connection-status.actions';
import { Store } from '@ngrx/store';
import { MsgID, TopicsKeys, LOCAL_STORAGE_KEY } from '@models';
import { ShuttingDownComponent } from '@components/shutting-down/shutting-down.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [HeaderComponent, ShuttingDownComponent, RouterOutlet],

    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
    private connectionSubscription: Subscription | null = null;
    private messageSubscription: Subscription | null = null;
    isConnecting: boolean = true;

    shuttingDown: { show: boolean; message?: string } = {
        show: false,
    };

    private mqttSubscriptions: Array<{
        topic: string;
        topicKey: string;
    }> = []; // Track MQTT topics for cleanup

    constructor(
        private router: Router,
        private mqttService: MqttService,
        private translate: TranslateService,
        private dummyInit: DummyInitService,
        private safeJsonService: SafeJsonService,
        private store: Store<AppState>,
        private localStorageService: LocalStorageService,
    ) {
        this.translate.setDefaultLang('en');
    }

    ngOnInit() {
        this.mqttService.connect();
        this.mqttService.userDataInit({
            id: 100,
        });
        this.connectionSubscription = this.mqttService.connectionStatus$.subscribe((status) => {
            if (status === true) {
                console.log('Connected to MQTT broker, subscribing to topics.');
                this.isConnecting = false;
                this.subscribeToTopics();
            } else if (status === false) {
                this.isConnecting = true;
                console.log('Still trying to connect to MQTT broker.');
            }
        });

        this.router.events.subscribe(() => {
            if (this.shuttingDown.show) {
                this.shuttingDown = {
                    show: false,
                    message: '',
                };
            }
        });
    }

    subscribeToTopics() {
        // let currentConnectStatus = 0;
        this.messageSubscription = this.mqttService.connectionStatus$.subscribe((status) => {
            if (status === true) {
                this.mqttService.mqttConfigLoaded$.subscribe((configLoaded) => {
                    if (configLoaded) {
                        const topics = this.mqttService.mqttConfig?.topics;
                        if (environment.dummy) {
                            if (topics) {
                                this.dummyInit.initializeDummyData(topics);
                            }
                        }
                        this.mqttService.subscribe({
                            topic: topics?.tcToAllTabs,
                            topicKey: TopicsKeys.ALL_TAB,
                            callback: (message) => {
                                const formatMess = JSON.parse(message);
                                const { header, payload } = formatMess || {};

                                if (header?.msgID) {
                                    switch (header.msgID) {
                                        case MsgID.SHUTTING_DOWN:
                                        case MsgID.SD_FOR_UPGRADING:
                                            this.localStorageService.removeItem(LOCAL_STORAGE_KEY.AUTH);
                                            this.shuttingDown = {
                                                show: true,
                                                message: payload?.message || '',
                                            };
                                            break;
                                        case MsgID.CHANGE_BTS_STATUS:
                                        case MsgID.CHANGE_BOLC_STATUS:
                                        case MsgID.CHANGE_CRP_STATUS:
                                        case MsgID.CHANGE_FMS_STATUS:
                                            this.store.dispatch(
                                                updateConnectionStatus({
                                                    payload,
                                                }),
                                            );
                                            break;
                                    }
                                }
                            },
                        });

                        this.mqttSubscriptions.push({
                            topic: topics?.tcToAllTabs,
                            topicKey: TopicsKeys.ALL_TAB,
                        });
                    }
                });
            }
        });
    }

    ngOnDestroy() {
        if (this.connectionSubscription) {
            this.connectionSubscription.unsubscribe();
        }
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }

        // Unsubscribe from all MQTT topics using the unsubscribe method from MqttService
        if (this.mqttSubscriptions?.length > 0) {
            this.mqttSubscriptions.forEach((topic) => {
                this.mqttService.unsubscribe(topic?.topic, topic?.topicKey);
            });
        }
    }
}
