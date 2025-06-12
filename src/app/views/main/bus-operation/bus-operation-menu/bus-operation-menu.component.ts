import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { routerUrls } from '@app/app.routes';
import { MqttService } from '@services/mqtt.service';
import { MsgID, MsgSubID, StartTripTypes, TopicsKeys } from '@models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { updateStartTrip } from '@store/main/main.reducer';

@Component({
    standalone: true,
    selector: 'bus-operation-menu',
    imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './bus-operation-menu.component.html',
    styleUrls: ['./bus-operation-menu.component.scss'],
})
export class BusOperationMenuComponent implements OnInit, OnDestroy {
    topics;
    loading: boolean = false;
    private mqttSubscriptions: Array<{
        topic: string;
        topicKey: string;
    }> = []; // Track MQTT topics for cleanup

    bustOperationButtons = [
        {
            id: 'start-trip-btn',
            imgSrc: '/assets/images/icons/bus-operation/start-trip.svg',
            label: 'Start Trip',
            onClick: (evt?: Event) => {
                console.log('start trip');
                this.mqttService?.publishWithMessageFormat({
                    topic: this.topics.mainTab?.get,
                    msgID: MsgID?.START_TRIP,
                    msgSubID: MsgSubID?.REQUEST,
                });

                this.store.dispatch(
                    updateStartTrip({
                        payload: {
                            fare: {},
                            fms: {},
                            type: undefined,
                            busStopList: [],
                            services: [],
                            dir: undefined,
                            variantName: undefined,
                            status: undefined,
                            message: undefined,
                        },
                    }),
                );
                this.loading = true;
            },
        },
        {
            id: 'end-shift-btn',
            imgSrc: '/assets/images/icons/bus-operation/end-shift.svg',
            label: 'End Shift',
            onClick: (evt?: Event) => {
                this.mqttService?.publishWithMessageFormat({
                    topic: this.topics.mainTab?.get,
                    msgID: MsgID?.END_SHIFT,
                    msgSubID: MsgSubID?.NOTIFY,
                    payload: {},
                });
                this.navigateTo([routerUrls?.private?.main?.busOperation?.endShift]);
            },
        },
    ];

    private destroy$ = new Subject<void>();
    constructor(
        private mqttService: MqttService,
        private router: Router,
        protected store: Store<AppState>,
    ) {}

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });

        // this.loading = true;
        // this.mqttService.connectionStatus$.pipe(takeUntil(this.destroy$)).subscribe((isConnected) => {
        //     if (isConnected) {
        //         this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
        //             if (configLoaded) {
        //                 const topics = this.mqttService.mqttConfig?.topics;
        //                 this.topics = topics;
        //                 if (topics) {
        //                     this.loading = true;
        //                     const startTripKey = `${TopicsKeys?.START_TRIP}-START_TRIP_BUS_OPERATION`;
        //                     console.log('startTripKey', startTripKey);
        //                     this.mqttService.subscribe({
        //                         topic: topics.mainTab?.response,
        //                         topicKey: startTripKey,
        //                         callback: (message) => {
        //                             const { header, payload } = JSON.parse(message);
        //                             if (
        //                                 header?.msgID === MsgID?.START_TRIP &&
        //                                 header?.msgSubID === MsgSubID?.RESPONSE
        //                             ) {
        //                                 console.log('Start Trip Response', payload);
        //                                 switch (payload?.type) {
        //                                     case StartTripTypes?.FMS_NOT_CONNECTED:
        //                                         this.navigateTo([
        //                                             routerUrls?.private?.main?.busOperation?.startTripNotConnected,
        //                                         ]);
        //                                         break;
        //                                     case StartTripTypes?.FMS_CONNECTED_PRO:
        //                                         this.navigateTo([
        //                                             routerUrls?.private?.main?.busOperation?.startTripConnectedPro,
        //                                         ]);
        //                                         break;
        //                                     case StartTripTypes?.FMS_CONNECTED_NON_PRO:
        //                                         this.navigateTo([
        //                                             routerUrls?.private?.main?.busOperation?.startTripConnectedNonPro,
        //                                         ]);
        //                                         break;
        //                                     case StartTripTypes?.FMS_CONNECTED_MISSING_TRIP_INFO:
        //                                         this.navigateTo([
        //                                             routerUrls?.private?.main?.busOperation
        //                                                 ?.startTripConnectedCannotFind,
        //                                         ]);
        //                                         break;
        //                                     case StartTripTypes?.FMS_FARE_BUS_STOP_MISMATCH:
        //                                         this.navigateTo([
        //                                             routerUrls?.private?.main?.busOperation?.fareBusStopMismatch,
        //                                         ]);
        //                                         break;
        //                                     default:
        //                                         break;
        //                                 }
        //                             }
        //                         },
        //                     });
        //                     this.mqttSubscriptions.push({
        //                         topic: topics.mainTab?.response,
        //                         topicKey: startTripKey,
        //                     });
        //                 }
        //             }
        //         });
        //     }
        // });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        // this.mqttSubscriptions.forEach((topic) => {
        //     this.mqttService.unsubscribe(topic?.topic, topic?.topicKey);
        // });
    }

    navigateTo(url) {
        this.router.navigate(url);
    }

    backToMain() {
        this.router.navigate(['/main']);
    }
}
