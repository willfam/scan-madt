import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';

import { routerUrls } from '@app/app.routes';
import { IStatusIndicators, MsgID, MsgSubID } from '@models';
import { MqttService } from '@services/mqtt.service';
import { selectConnectionStatusState, ConnectionStatusState } from '@store/connection-status/connection-status.reducer';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { takeUntil } from 'rxjs/operators';
import { environment } from '@env/environment';
@Component({
    standalone: true,
    selector: 'app-header',
    imports: [CommonModule, MatSlideToggleModule, MatIconModule, TranslateModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [DatePipe],
})
// routerUrls?.private?.main?.busOperation?.startTrip
export class HeaderComponent implements OnInit {
    @Input({ required: true }) screen!: string; // main/ ticketing/ maintenance
    @Input() onlyDateTime: boolean = false;
    @Input() disableButtons?: string[] = [];
    @Input() activeButtons?: string[] = [];
    currentDate = new Date();
    intervalId;

    buttons: {
        id: string;
        imgSrc?: string;
        label: string;
        navigateTo?: string;
        screens: string[];
        class: string;
        data?: any;
        msgID?: number;
        type?: string;
        onClick?: (params: any, allData?: any) => void;
    }[] = [
        {
            id: 'settings-btn',
            imgSrc: '/assets/images/icons/main/settings.svg',
            label: 'SETTINGS',
            navigateTo: `/${routerUrls?.private?.main?.settings}`,
            screens: [
                routerUrls?.private?.main?.url,
                routerUrls?.private?.fare?.url,
                routerUrls?.private?.busOperation?.url,
                routerUrls?.private?.main?.outOfService,
                routerUrls?.private?.main?.outOfServiceNoData,
                routerUrls?.private?.main?.busOperation?.url,
                routerUrls?.private?.main?.busOperation?.startTripValidInfo,
                routerUrls?.private?.main?.busOperation?.endShift,
            ],
            class: 'button',
            type: 'button',
        },
        {
            id: 'log-out-btn',
            imgSrc: '/assets/images/icons/main/logout.svg',
            label: 'LOGOUT',
            navigateTo: '',
            screens: [routerUrls?.private?.maintenance?.url],
            class: 'button',
            type: 'button',
            onClick: () => {
                // this.mqttService.publishWithMessageFormat({
                //     topic: this.topics?.mainTab?.get,
                //     msgID: MsgID.LOGOUT,
                //     msgSubID: MsgSubID.NOTIFY,
                //     payload: {},
                // });
                this.handleNavigate(`/${routerUrls?.private?.logOut?.url}`);
            },
        },
        {
            id: 'end-trip-btn',
            imgSrc: '/assets/images/icons/main/end-trip.svg',
            label: 'END_TRIP',
            // navigateTo: `/${routerUrls?.private?.main?.endTrip}`,
            screens: [routerUrls?.private?.main?.url],
            class: 'button',
            type: 'button',
            onClick: () => {
                this.mqttService.publishWithMessageFormat({
                    topic: this.topics?.mainTab?.get,
                    msgID: MsgID.END_TRIP,
                    msgSubID: MsgSubID.REQUEST,
                    payload: {},
                });
            },
        },
        {
            id: 'lock-btn',
            imgSrc: '/assets/images/icons/main/lock.svg',
            label: 'LOCK',
            // navigateTo: `/${routerUrls?.private?.main?.lockScreen}`,
            screens: [
                routerUrls?.private?.main?.url,
                routerUrls?.private?.fare?.url,
                routerUrls?.private?.busOperation?.url,
                routerUrls?.private?.main?.outOfService,
                routerUrls?.private?.main?.outOfServiceNoData,
                routerUrls?.private?.main?.busOperation?.url,
                routerUrls?.private?.main?.busOperation?.startTripValidInfo,
                routerUrls?.private?.main?.busOperation?.endShift,
            ],
            class: 'button lock-button',
            type: 'button',
            onClick: () => {
                this.mqttService.publishWithMessageFormat({
                    topic: this.topics?.mainTab?.get,
                    msgID: MsgID.LOCK,
                    msgSubID: MsgSubID.REQUEST,
                    payload: {},
                });
                // this.handleNavigate(`/${routerUrls?.private?.logOut?.url}`);
            },
        },
        {
            id: 'manual-login',
            label: 'Manual Login',
            screens: [
                routerUrls?.private?.main?.login,
                routerUrls?.private?.main?.dagwOperation,
                routerUrls?.private?.main?.tapCardLogin,
            ],
            class: 'button',
            type: 'button',
            onClick: () => {
                this.mqttService.publishWithMessageFormat({
                    topic: this.topics?.mainTab?.get,
                    msgID: MsgID.MANUAL_LOGIN,
                    msgSubID: MsgSubID.REQUEST,
                    payload: {},
                });
                // this.handleNavigate(`/${routerUrls?.private?.main?.manualLogin}`);
            },
        },
        {
            id: 'wlan-btn',
            imgSrc: '/assets/images/icons/main/wlan.svg',
            label: 'WLAN',
            onClick: () => {
                this.mqttService.publishWithMessageFormat({
                    topic: this.topics?.mainTab?.get,
                    msgID: MsgID.TRIGGER_DAGW_OPERATION,
                    msgSubID: MsgSubID.REQUEST,
                    payload: {
                        triggerDAGWButton: true,
                    },
                });
            },
            screens: [
                routerUrls?.private?.main?.login,
                routerUrls?.private?.main?.tapCardLogin,
                routerUrls?.private?.main?.dagwOperation,
            ],
            class: 'button',
            type: 'button',
        },
    ];

    statusIndicators: IStatusIndicators[] = [
        { label: 'BTS', connected: false, trigger: true },
        { label: 'BOLC', connected: false, trigger: true },
        { label: 'Fare', connected: true, trigger: true },
        { label: 'FMS', connected: false, trigger: true },
        { label: 'CRP', connected: false, trigger: true }, // You can modify this condition as needed
    ];

    private destroy$ = new Subject<void>();
    // allConnectionStatus$: Observable<IConnectionStatus>;
    connectionStatusState$: Observable<ConnectionStatusState>;

    topics;

    constructor(
        public datepipe: DatePipe,
        private router: Router,
        private mqttService: MqttService,
        private store: Store<AppState>,
    ) {
        // this.allConnectionStatus$ = this.store.select(allConnectionStatus);
        this.connectionStatusState$ = this.store.select(selectConnectionStatusState);
    }

    ngOnInit() {
        // this.allConnectionStatus$.pipe(takeUntil(this.destroy$))?.subscribe((status) => {
        //     const formatStatus = this.statusIndicators?.map((item) => {
        //         return {
        //             ...item,
        //             connected: status[item?.label?.toLowerCase()],
        //         };
        //     });
        //     this.statusIndicators = formatStatus;
        // });
        if (environment?.bolcTestingBtn) {
            this.buttons.push({
                id: 'bolc-testing-btn',
                imgSrc: '/assets/images/icons/main/bolc-testing.svg',
                label: 'BOLC',
                msgID: MsgID.TRIGGER_BOLC_STATUS,
                screens: [
                    routerUrls?.private?.main?.dagwOperation,
                    routerUrls?.private?.main?.fareConsoleSetting,
                    routerUrls?.private?.main?.login,
                    routerUrls?.private?.main?.tapCardLogin,
                    routerUrls?.private?.main?.outOfService,
                    routerUrls?.private?.main?.outOfServiceNoData,
                ],
                class: 'switch',
                type: 'switch',
            });
        }
        this.connectionStatusState$.pipe(takeUntil(this.destroy$))?.subscribe((status) => {
            const mapping = {
                BTS: {
                    connected: status.connection?.statusBTS,
                },
                BOLC: {
                    connected: status.connection?.statusBOLC,
                    trigger: status.trigger?.triggerBOLCButton,
                },
                FMS: {
                    connected: status.connection?.statusFMS,
                },
                CRP: {
                    connected: status.connection?.statusCRP,
                },
            };
            const formatStatus = this.statusIndicators?.map((item) => {
                return {
                    ...item,
                    ...mapping[item?.label],
                };
            });
            this.statusIndicators = formatStatus;
        });

        this.intervalId = setInterval(() => {
            this.currentDate = new Date();
        }, 1000);

        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });
    }

    handleNavigate(page: string) {
        this.router.navigate([page]);
    }

    toggleSlide(label: string) {
        const item = this.statusIndicators.find((item) => item?.label === label);
        return item?.trigger || false;
    }

    handleToggle(event: MatSlideToggleChange, label: string, msgID?: number) {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.madtToAllTabs,
            msgID: msgID || 0,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                [label]: event.checked,
            },
        });
    }

    ngOnDestroy() {
        clearInterval(this.intervalId);
        this.destroy$.next();
        this.destroy$.complete();
    }
}
