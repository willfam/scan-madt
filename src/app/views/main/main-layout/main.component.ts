import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Observable, Subject, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
    updateBusStopList,
    updateCurrentNowDest,
    updateCurrentFareBusStop,
    updateUserInfo,
    activeCVs,
    freeMode,
    updateActiveCVs,
    updateFreeCVs,
    currentFareBusStop,
    updateDeviation,
    busStopList,
    fareBusStopList,
    updateNextBusInfo,
    updateBootUp,
    updateFareConsole,
    updateOutOfService,
    updateDagwOperation,
    updateTapCardLogin,
    updateManualLogin,
    updateEndTripInfo,
    updateCommissionBusIdInformation,
    updateExternalDevices,
    updateTestPrinter,
    updateLanguage,
    updateStartTrip,
    updateLockScreen,
    updateCvUpgradeStatus,
    updateBreakDownInfo,
} from '@store/main/main.reducer';
import { isLoading, updateIsOnTrip, updateLoading } from '@store/global/global.reducer';
import {
    updateConnectionStatus,
    updateConnectionStatusDisplay,
} from '@store/connection-status/connection-status.actions';
import { routerUrls } from '@app/app.routes';
import { HeaderComponent } from '@components/layout/header/header.component';
import { AppState } from '@store/app.state';
import { MqttService } from '@services/mqtt.service';
import {
    CvIcons,
    ICurrentFareBusStop,
    IFmsBusStop,
    MsgSubID,
    MsgID,
    CvStatusType,
    ResponseStatus,
    CVLabels,
    CommissioningType,
    MainPagePopUp,
    IAuth,
    StartTripTypes,
    TopicsKeys,
    LOCAL_STORAGE_KEY,
    IPopUpControl,
    IFareBusStop,
} from '@models';
import { SafeJsonService } from '@services/safe-json.service';
import { UtilsServices } from '@services/utils.service';
import { takeUntil, filter, take } from 'rxjs/operators';
import { ShuttingDownComponent } from '@components/shutting-down/shutting-down.component';
import { ShuttingDownWarningComponent } from '@components/shutting-down-warning/shutting-down-warning.component';
import { BusOffRouteComponent } from '@components/bus-off-route/bus-off-route.component';
import { AutoDisableBlsComponent } from '@components/auto-disable-bls/auto-disable-bls.component';
import { LocalStorageService } from '@services/local-storage.service';
import { ButtonSoundDirective } from '@directives/button-sound.directive';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        TranslateModule,
        HeaderComponent,
        RouterOutlet,
        ShuttingDownComponent,
        ShuttingDownWarningComponent,
        BusOffRouteComponent,
        AutoDisableBlsComponent,
        ButtonSoundDirective,
    ],
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    providers: [DatePipe],
})
export class MainComponent implements OnInit, OnDestroy {
    MsgID = MsgID;
    private destroy$ = new Subject<void>();
    showPop: any = null;
    private isBusDirIndoSubscribed = false;
    currentDate = new Date();
    intervalId: any;
    activeCVs$: Observable<number[]>;
    currentFareBusStop$: Observable<IFareBusStop | null>;
    currentFareBusStop!: IFareBusStop | null;
    freeMode$: Observable<boolean>;
    freeMode: boolean = false;
    cvsActive: number[] = [];
    busStopList$: Observable<IFmsBusStop[]>;
    fareBusStopList$: Observable<IFareBusStop[]>;
    fareBusStopList: IFareBusStop[] = [];
    isLoading$: Observable<boolean>;
    loading: boolean = true;
    topics;
    currentScreen: string = '/main';
    currentRoute: string = '';
    mainUrl = `/${routerUrls?.private?.main?.url}`;
    loginUrl = `/${routerUrls?.private?.main?.login}`;
    outOfServiceUrl = `/${routerUrls?.private?.main?.outOfService}`;
    outOfServiceUrlNoData = `/${routerUrls?.private?.main?.outOfServiceNoData}`;
    languageSetting = `/${routerUrls?.private?.main?.languageSetting}`;
    fareConsoleSetting = `/${routerUrls?.private?.main?.fareConsoleSetting}`;
    tapCardLoginUrl = `/${routerUrls?.private?.main?.tapCardLogin}`;
    manualLoginUrl = `/${routerUrls?.private?.main?.manualLogin}`;
    busOperation = `/${routerUrls?.private?.main?.busOperation?.url}`;
    busOperationStartTrip = `/${routerUrls?.private?.main?.busOperation?.startTripValidInfo}`;
    startTripInvalidInfo = `/${routerUrls?.private?.main?.busOperation?.startTripInvalidInfo}`;
    busOperationEndShift = `/${routerUrls?.private?.main?.busOperation?.endShift}`;
    busOperationExternalDevices = `/${routerUrls?.private?.main?.busOperation?.externalDevices}`;
    dagwOperationUrl = `/${routerUrls?.private?.main?.dagwOperation}`;
    commissioningInProgress = `/${routerUrls?.private?.main?.commissioning?.inProgress}`;
    commissioningClearingAllData = `/${routerUrls?.private?.main?.commissioning?.clearingAllData}`;
    commissioningCompletedCleaning = `/${routerUrls?.private?.main?.commissioning?.completedClearning}`;
    shuttingDown: IPopUpControl = { show: false };
    shuttingDownWarning: IPopUpControl = { show: false };
    busOffRoute: IPopUpControl = { show: false };
    disableBls: IPopUpControl = { show: false };
    cvStatusTypes = CvStatusType;

    hidePopup: boolean = false;

    private mqttSubscriptions: Array<{
        topic: string;
        topicKey: string;
    }> = []; // Track MQTT topics for cleanup

    cvLists: CvIcons[] = [];

    // private auth$: Observable<IAuth>;
    auth: IAuth = {
        isLoggedIn: false,
    };

    constructor(
        public datepipe: DatePipe,
        protected router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
        private utilsServices: UtilsServices,
        private safeJsonService: SafeJsonService,
        private localStorageService: LocalStorageService,
    ) {
        this.activeCVs$ = this.store.select(activeCVs);
        this.freeMode$ = this.store.select(freeMode);
        this.currentFareBusStop$ = this.store.select(currentFareBusStop);
        this.busStopList$ = this.store.select(busStopList);
        this.fareBusStopList$ = this.store.select(fareBusStopList);
        this.isLoading$ = this.store.select(isLoading);
        // this.auth$ = this.store.select(auth);
    }

    ngOnInit() {
        // Using Basic Interval to update time every second
        this.intervalId = setInterval(() => {
            this.currentDate = new Date();
        }, 1000);

        this.initStore();
        // Ensure broker is connected and config is loaded before subscribing
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

        // this.auth$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
        //     this.auth = data;
        // });
        this.isLoading$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.loading = data;
        });

        const authStr = this.localStorageService.getItem(LOCAL_STORAGE_KEY.AUTH);
        if (authStr) {
            this.auth = JSON.parse(authStr);
        }

        this.currentRoute = this.router.url;
        this.currentScreen = this.formatMainHeader(this.router.url);
        this.router.events
            .pipe(
                takeUntil(this.destroy$), // Unsubscribe when destroy$ emits
            )
            .subscribe((event) => {
                if (event instanceof NavigationStart) {
                    this.currentRoute = event?.url;
                    this.currentScreen = this.formatMainHeader(event?.url);

                    if (event?.url?.indexOf(routerUrls?.private?.main?.busStopInformation) > -1) {
                        this.hidePopup = false;
                    } else {
                        this.hidePopup = true;
                    }
                }
            });
    }

    hexToRgb(hex) {
        // Remove the '0x' prefix if it exists
        hex = hex.replace(/^0x/, '');

        // Parse the red, green, and blue components from the hex string
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        return `rgb(${r}, ${g}, ${b})`;
    }

    initMqttService(topics) {
        const currentMainPageMess = 0;
    }

    messValidation(timeStamp, currentMainPAgeMess, callback) {
        let currentMess = 0;
        if (timeStamp >= currentMainPAgeMess) {
            callback();
            currentMess = timeStamp;
            if (this.loading) {
                this.store.dispatch(updateLoading({ payload: false }));
            }
        }
        return currentMess;
    }

    validatedAuth(topics) {
        let currentBootUpMess = 0;
        let currentOutOfServiceInfo = 0;
        let currentOutOfServiceMissingData = 0;
        let cvUpgradeStatus = 0;
        let currentBusOperationMenu = 0;

        let currentDgwOperation = 0;
        let currentTriggerBolcStatus = 0;
        let currentChangeBolcStatus = 0;
        let currentLoginTapCard = 0;

        let currentTapCardPIN = 0;
        let currentBCTapCardDuty = 0;
        let currentEndShift = 0;
        let currentManualPIN = 0;
        let currentManualDuty = 0;
        let currentCommissioning = 0;
        let currentEndTrip = 0;
        let currentBreakDown = 0;
        let currentStartTripPopUp = 0;
        let currentFareConsole = 0;
        let currentBusId = 0;

        let currentExternalDevices = 0;
        let currentTestPrinter = 0;

        let currentLanguage = 0;

        let currentMainPageMess = 0;
        let currentCVStatus = 0;
        let currentCVIcons = 0;
        let currentFareBusStopMess = 0;
        let currentBusStopListMess = 0;
        let currentHeadwayMess = 0;
        let currentNextBusStop = 0;
        let currentFareBusStopList = 0;

        let currentStartTrip = 0;
        let currentStartTripForSpecialCase = 0;
        let currentLock = 0;
        let currentFreeMsg = 0;
        let currentFrontDoorsMsg = 0;
        let currentRearDoorsMsg = 0;
        let currentLockScreen = 0;
        let currentShuttingDownWarning = 0;
        let currentBusOffRoute = 0;
        let currentDisableBls = 0;
        let currentUpDownButton = 0;
        let currentRedeemMsg = 0;

        this.mqttService.subscribe({
            topic: topics.mainTab?.response,
            topicKey: TopicsKeys.MAIN_TAB,
            callback: (message) => {
                const formatMess = JSON.parse(message);
                const { header, payload } = formatMess;
                if (payload?.status === ResponseStatus.NA) {
                    return;
                }

                this.shuttingDown = {
                    show: false,
                    message: '',
                };
                this.shuttingDownWarning = {
                    show: false,
                    message: '',
                };
                this.busOffRoute = {
                    show: false,
                    message: '',
                };

                const dateTime = new Date(header?.dateTime);

                if (
                    [
                        MsgID.MAIN_PAGE_DATA,
                        MsgID.CV_STATUS,
                        MsgID.CV_ICONS,
                        MsgID.UPDATE_FARE_BUS_STOP,
                        MsgID.UPDATE_FMS_BUS_STOP,
                        MsgID.UPDATE_HEADWAY,
                        MsgID.UPDATE_FARE_BUS_STOP_LIST,
                        MsgID.NEXT_BUS_INFO,
                    ].includes(header?.msgID)
                ) {
                    switch (header?.msgID) {
                        case MsgID.MAIN_PAGE_DATA:
                            if ([MsgSubID.RESPONSE, MsgSubID.NOTIFY].includes(header.msgSubID)) {
                                currentMainPageMess = this.messValidation(dateTime, currentMainPageMess, () => {
                                    this.showPop = null;
                                    const busStop: { busStopList?: []; fareBusStopList?: [] } = {};
                                    let currentFareBusStopId = '';
                                    if (payload?.fmsBusStopList?.length > 0) {
                                        busStop.busStopList = payload?.fmsBusStopList;
                                        // this.store.dispatch(
                                        //     updateBusStopList({ busStopList: payload?.fmsBusStopList }),
                                        // );
                                    }

                                    if (payload.fareBusStopList?.length > 0) {
                                        const activeItem = payload?.fareBusStopList?.find(
                                            (item) => item?.flag === 'active',
                                        );
                                        busStop.fareBusStopList = payload?.fareBusStopList;

                                        if (activeItem) {
                                            currentFareBusStopId = activeItem.Busid;
                                        }
                                    }

                                    if (Object.keys(busStop).length > 0) {
                                        this.store.dispatch(updateBusStopList(busStop));
                                    }

                                    if (currentFareBusStopId !== '') {
                                        this.store.dispatch(
                                            updateCurrentFareBusStop({
                                                payload: currentFareBusStopId,
                                            }),
                                        );
                                    }

                                    if (payload?.cvList?.length > 0) {
                                        this.cvLists = payload?.cvList
                                            ?.map((item) => ({
                                                ...item,
                                                id: item.cvNumber,
                                                activeIcon: null,
                                                timer: null,
                                                label: '',
                                                error: false,
                                                statuses: item.statuses,
                                            }))
                                            .sort((a, b) => a.id - b.id);

                                        this.store.dispatch(
                                            updateFreeCVs({
                                                payload: this.cvLists?.some((_cv) =>
                                                    _cv.statuses?.includes(CvStatusType.FREE),
                                                ),
                                            }),
                                        );
                                    }

                                    this.store.dispatch(
                                        updateUserInfo({
                                            userInfo: {
                                                busServiceNum: payload?.busServiceNum,
                                                plateNum: payload?.plateNum,
                                                spid: payload?.spid,
                                                dir: payload?.dir,
                                                km: payload?.km,
                                            },
                                        }),
                                    );
                                });

                                this.navigate(routerUrls?.private?.main?.busStopInformation);
                            }
                            break;
                        case MsgID.CV_STATUS:
                            if ([MsgSubID.RESPONSE, MsgSubID.NOTIFY].includes(header.msgSubID)) {
                                currentCVStatus = this.messValidation(dateTime, currentCVStatus, () => {
                                    this.cvLists = payload
                                        ?.map((item) => ({
                                            ...item,
                                            id: item.cvNumber,
                                            activeIcon: null,
                                            timer: null,
                                            label: '',
                                            error: false,
                                            statuses: item.statuses,
                                        }))
                                        .sort((a, b) => a.id - b.id);

                                    this.store.dispatch(
                                        updateFreeCVs({
                                            payload: this.cvLists?.some((_cv) =>
                                                _cv.statuses?.includes(CvStatusType.FREE),
                                            ),
                                        }),
                                    );
                                });
                            }
                            break;
                        case MsgID.CV_ICONS:
                            if ([MsgSubID.RESPONSE, MsgSubID.NOTIFY].includes(header.msgSubID)) {
                                currentCVIcons = this.messValidation(dateTime, currentCVIcons, () => {
                                    this.handleChangeCVIcons({ payload });
                                });
                            }

                            break;
                        case MsgID.UPDATE_FARE_BUS_STOP:
                            if ([MsgSubID.NOTIFY].includes(header.msgSubID)) {
                                let fareBusStop;
                                if (payload?.index > -1) {
                                    fareBusStop = this?.fareBusStopList[payload?.index];
                                }

                                if (payload?.Busid) {
                                    if (!fareBusStop) {
                                        fareBusStop = this?.fareBusStopList.find(
                                            (item) => item?.Busid === payload?.Busid,
                                        );
                                    }
                                }
                                currentFareBusStopMess = this.messValidation(dateTime, currentFareBusStopMess, () => {
                                    this.store.dispatch(
                                        updateCurrentFareBusStop({
                                            payload: fareBusStop?.Busid,
                                            manualBls: payload?.manualBls,
                                            misMatch: payload?.misMatch,
                                        }),
                                    );
                                });
                            }
                            break;

                        case MsgID.UPDATE_FMS_BUS_STOP:
                            if ([MsgSubID.NOTIFY].includes(header.msgSubID)) {
                                const { fmsBusStopList, ...rest } = payload;
                                currentBusStopListMess = this.messValidation(dateTime, currentBusStopListMess, () => {
                                    if (fmsBusStopList && fmsBusStopList.length > 0) {
                                        this.store.dispatch(
                                            updateBusStopList({
                                                busStopList: fmsBusStopList,
                                            }),
                                        );
                                    }
                                    this.store.dispatch(
                                        updateUserInfo({
                                            userInfo: rest,
                                        }),
                                    );
                                    this.showPop = null;
                                });
                            }
                            break;

                        case MsgID.UPDATE_FARE_BUS_STOP_LIST:
                            if ([MsgSubID.NOTIFY].includes(header.msgSubID)) {
                                currentFareBusStopList = this.messValidation(dateTime, currentFareBusStopList, () => {
                                    const activeItem = payload?.fareBusStopList?.find(
                                        (item) => item?.flag === 'active',
                                    );
                                    this.store.dispatch(
                                        updateBusStopList({
                                            fareBusStopList: payload?.fareBusStopList,
                                        }),
                                    );
                                    if (activeItem) {
                                        this.store.dispatch(
                                            updateCurrentFareBusStop({
                                                payload: activeItem.Busid,
                                            }),
                                        );
                                    }
                                });
                            }
                            break;
                        case MsgID.UPDATE_HEADWAY:
                            if ([MsgSubID.NOTIFY].includes(header.msgSubID)) {
                                currentHeadwayMess = this.messValidation(dateTime, currentHeadwayMess, () => {
                                    this.store.dispatch(
                                        updateDeviation({
                                            payload: {
                                                ...payload,
                                                color: this.hexToRgb(payload?.color),
                                            },
                                        }),
                                    );
                                });
                            }
                            break;
                        case MsgID.NEXT_BUS_INFO:
                            if ([MsgSubID.NOTIFY].includes(header.msgSubID)) {
                                currentNextBusStop = this.messValidation(dateTime, currentNextBusStop, () => {
                                    this.store.dispatch(
                                        updateNextBusInfo({
                                            payload,
                                        }),
                                    );
                                });
                            }
                            break;

                        default:
                            break;
                    }
                }

                //Please migrate all the redirections above to the code below.
                if (header?.msgSubID === MsgSubID?.NOTIFY) {
                    switch (header?.msgID) {
                        case MsgID?.BOOT_UP:
                            currentBootUpMess = this.messValidation(dateTime, currentBootUpMess, () => {
                                this.store.dispatch(
                                    updateBootUp({
                                        payload: payload,
                                    }),
                                );
                                this.handleEndShiftSuccess();
                                this.navigate(routerUrls?.private?.main?.url);
                            });
                            break;
                        // case MsgID?.SHUTTING_DOWN:
                        // case MsgID?.SD_FOR_UPGRADING:
                        case MsgID?.SD_FOR_UPGRADING_FROM_TO:
                            this.shuttingDown = {
                                show: true,
                                message: payload?.message || '',
                            };
                            this.loading = false;
                            break;
                        case MsgID?.OUT_OF_SERVICE_INFO:
                            currentOutOfServiceInfo = this.messValidation(dateTime, currentOutOfServiceInfo, () => {
                                this.store?.dispatch(
                                    updateOutOfService({
                                        payload,
                                    }),
                                );
                                this.navigate(routerUrls?.private?.main?.login);
                            });
                            break;
                        case MsgID?.OUT_OF_SERVICE_MISSING_DATA:
                            currentOutOfServiceMissingData = this.messValidation(
                                dateTime,
                                currentOutOfServiceMissingData,
                                () => {
                                    this.store?.dispatch(
                                        updateOutOfService({
                                            payload,
                                        }),
                                    );
                                    this.navigate(routerUrls?.private?.main?.login);
                                },
                            );
                            break;
                        case MsgID?.CV_UPGRADE:
                            cvUpgradeStatus = this.messValidation(dateTime, cvUpgradeStatus, () => {
                                this.store?.dispatch(
                                    updateCvUpgradeStatus({
                                        payload: payload?.status,
                                    }),
                                );
                                this.navigate(routerUrls?.private?.main?.login);
                            });
                            break;

                        case MsgID?.DAGW_OPERATION:
                            currentDgwOperation = this.messValidation(dateTime, currentDgwOperation, () => {
                                this.store.dispatch(
                                    updateDagwOperation({
                                        payload,
                                    }),
                                );
                                this.navigate(routerUrls?.private?.main?.dagwOperation);
                            });
                            break;
                        // case MsgID.TRIGGER_DAGW_OPERATION:
                        //     currentBootUpMess = this.messValidation(dateTime, currentBootUpMess, () => {
                        //         this.store.dispatch(
                        //             updateTriggerDAGWButton({
                        //                 payload: payload['triggerDAGWButton'],
                        //             }),
                        //         );
                        //     });
                        //     break;
                        case MsgID.TRIGGER_BOLC_STATUS:
                            currentTriggerBolcStatus = this.messValidation(dateTime, currentTriggerBolcStatus, () => {
                                this.store.dispatch(
                                    updateConnectionStatusDisplay({
                                        payload,
                                    }),
                                );
                            });
                            break;
                        case MsgID.CHANGE_BOLC_STATUS:
                            currentChangeBolcStatus = this.messValidation(dateTime, currentChangeBolcStatus, () => {
                                this.store.dispatch(
                                    updateConnectionStatus({
                                        payload,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.BUS_OPERATION_MENU:
                            currentBusOperationMenu = this.messValidation(dateTime, currentBusOperationMenu, () => {
                                this.navigate(routerUrls?.private?.main?.busOperation?.url);
                            });
                            break;

                        case MsgID?.BC_TAP_CARD_LOGIN:
                        case MsgID?.BC_TAP_CARD_PIN:
                            currentLoginTapCard = this.messValidation(dateTime, currentLoginTapCard, () => {
                                this.store.dispatch(
                                    updateTapCardLogin({
                                        payload: Object.assign({}, header, payload),
                                        msgID: header?.msgID,
                                    }),
                                );
                                this.navigate(routerUrls?.private?.main?.tapCardLogin);
                            });
                            break;
                        case MsgID?.BC_TAP_CARD_DUTY:
                            currentBCTapCardDuty = this.messValidation(dateTime, currentBCTapCardDuty, () => {
                                this.navigate(routerUrls?.private?.main?.busOperation?.url);
                                this.handleLoginSuccess(1);
                                return;
                            });
                            break;
                        case MsgID?.MANUAL_LOGIN_PIN:
                        case MsgID?.MANUAL_LOGIN_PIN2:
                        case MsgID?.MANUAL_LOGIN_STAFF_ID:
                            currentManualPIN = this.messValidation(dateTime, currentManualPIN, () => {
                                this.store.dispatch(
                                    updateManualLogin({
                                        msgID: header?.msgID,
                                        payload: Object.assign({}, header, {
                                            ...payload,
                                            timeout: payload.timeout || undefined,
                                        }),
                                    }),
                                );
                                this.navigate(routerUrls?.private?.main?.manualLogin);
                            });
                            break;
                        case MsgID?.MANUAL_LOGIN_DUTY:
                            currentManualDuty = this.messValidation(dateTime, currentManualDuty, () => {
                                this.navigate(routerUrls?.private?.main?.busOperation?.url);
                                this.handleLoginSuccess(1);
                            });
                            break;

                        case MsgID?.MS_TAP_CARD_LOGIN:
                            currentLoginTapCard = this.messValidation(dateTime, currentLoginTapCard, () => {
                                this.store.dispatch(
                                    updateTapCardLogin({
                                        payload: Object.assign({}, header, payload),
                                        msgID: header?.msgID,
                                    }),
                                );
                                this.navigate(routerUrls?.private?.main?.tapCardLogin);
                            });
                            break;
                        case MsgID?.LOGOUT_SUCCESS:
                            setTimeout(() => {
                                this.localStorageService.removeItem(LOCAL_STORAGE_KEY.AUTH);
                                this.auth = { isLoggedIn: false, loggedInType: undefined };
                                this.navigate(routerUrls?.private?.main?.login);
                            });
                            break;
                        case MsgID?.FARE_CONSOLE:
                            currentFareConsole = this.messValidation(dateTime, currentFareConsole, () => {
                                this.store.dispatch(
                                    updateFareConsole({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                                this.navigate(routerUrls?.private?.main?.fareConsoleSetting);
                            });
                            break;

                        case MsgID?.START_TRIP_POP_UP_MESSAGE:
                            currentStartTripPopUp = this.messValidation(dateTime, currentStartTripPopUp, () => {
                                // console.log('payload', payload?.type);
                                switch (payload?.type) {
                                    case MainPagePopUp?.BUS_STOP_MISMATCH:
                                        this.showPop = {
                                            title: 'BUS_STOP_MISMATCH',
                                            caption: 'BUS_STOP_MISMATCH_CAPTION_MAIN_PAGE',
                                        };
                                        break;
                                    case MainPagePopUp?.TRIP_MISMATCH:
                                        this.showPop = {
                                            title: 'TRIP_MISMATCH',
                                            caption: 'TRIP_MISMATCH_CAPTION',
                                        };
                                        break;
                                    case MainPagePopUp?.DRIVER_ID_CHANGES:
                                        this.showPop = {
                                            title: 'DRIVER_ID_CHANGED_IN_FMS',
                                            caption: 'DRIVER_ID_CHANGED_IN_FMS_CAPTION',
                                        };
                                        break;
                                    case MainPagePopUp?.DRIVER_BLOCKED_LOG_OFF:
                                        this.showPop = {
                                            title: 'DRIVER_BLOCK_LOGGED_OFF',
                                            caption: 'DRIVER_BLOCK_LOGGED_OFF_CAPTION',
                                        };
                                        break;
                                    case MainPagePopUp?.FMS_NO_INFO:
                                        this.showPop = {
                                            title: 'WAITING_FOR_FMS_INFO',
                                            loading: true,
                                            hideButton: true,
                                        };
                                        break;
                                    default:
                                        this.showPop = null;
                                        break;
                                }
                            });
                            break;
                        case MsgID?.BOOT_UP_COMMISSIONING:
                            currentCommissioning = this.messValidation(dateTime, currentCommissioning, () => {
                                if (payload?.message === CommissioningType?.IN_PROGRESS) {
                                    this.navigate(routerUrls?.private?.main?.commissioning?.inProgress);
                                }
                                if (payload?.message === CommissioningType?.CLEARING_ALL_DATA) {
                                    this.navigate(routerUrls?.private?.main?.commissioning?.clearingAllData);
                                }
                                if (payload?.message === CommissioningType?.COMPLETED_CLEANING) {
                                    this.navigate(routerUrls?.private?.main?.commissioning?.completedClearning);
                                }
                            });
                            break;

                        case MsgID?.LANGUAGE:
                            currentLanguage = this.messValidation(dateTime, currentLanguage, () => {
                                this.store.dispatch(
                                    updateLanguage({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                                this.handleEndShiftSuccess();
                                this.navigate(routerUrls?.private?.main?.languageSetting);
                            });
                            break;

                        case MsgID.LOCK_CONFIRM:
                            currentLockScreen = this.messValidation(dateTime, currentLockScreen, () => {
                                this.store.dispatch(
                                    updateLockScreen({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                                this.navigate(routerUrls?.private?.main?.lockScreen);
                            });
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

                        case MsgID.END_TRIP:
                            this.store.dispatch(
                                updateEndTripInfo({
                                    payload: {
                                        status: undefined,
                                        title: '',
                                        direction: '',
                                        service: 0,
                                        firstBusStop: {},
                                        lastBusStop: {},
                                        busStopList: [],
                                        reasonList: [],
                                        timeout: payload.timeout || undefined,
                                    },
                                    msgID: header?.msgID,
                                }),
                            );
                            this.navigate(`/${routerUrls?.private?.main?.endTrip}`);
                            break;

                        case MsgID.START_TRIP_INFORMATION_FOR_SPECIAL_CASE:
                            currentStartTripForSpecialCase = this.messValidation(
                                dateTime,
                                currentStartTripForSpecialCase,
                                () => {
                                    if (
                                        [
                                            StartTripTypes?.FMS_VALID_INFO,
                                            StartTripTypes?.FMS_TRIP_INFO_MISMATCH,
                                            StartTripTypes?.FMS_BUS_STOP_MISMATCH,
                                        ].includes(payload?.type)
                                    ) {
                                        this.store.dispatch(
                                            updateStartTrip({
                                                payload: {
                                                    fms: {
                                                        serviceNumber: payload?.serviceNumber,
                                                        busStop: payload?.busStop,
                                                        dir: payload?.dir,
                                                        variantName: payload?.variantName,
                                                    },
                                                    ...payload,
                                                },
                                                msgID: header?.msgID,
                                            }),
                                        );
                                    } else if ([StartTripTypes?.FMS_NO_INFO].includes(payload?.type)) {
                                        this.store.dispatch(
                                            updateStartTrip({
                                                payload,
                                                msgID: header?.msgID,
                                            }),
                                        );
                                    }
                                    this.navigate(routerUrls?.private?.main?.busOperation?.startTripValidInfo);
                                },
                            );
                            break;
                        default:
                            break;
                    }
                }

                if (header?.msgSubID === MsgSubID?.RESPONSE) {
                    switch (header?.msgID) {
                        case MsgID?.BC_TAP_CARD_PIN:
                        case MsgID?.BC_TAP_CARD_DUTY:
                            currentTapCardPIN = this.messValidation(dateTime, currentTapCardPIN, () => {
                                this.store.dispatch(
                                    updateTapCardLogin({
                                        msgID: header?.msgID,
                                        payload: Object.assign({}, header, payload),
                                    }),
                                );
                                // this.navigate(routerUrls?.private?.main?.tapCardLogin);
                            });
                            break;
                        case MsgID?.MS_TAP_CARD_PIN:
                            currentTapCardPIN = this.messValidation(dateTime, currentTapCardPIN, () => {
                                if (payload?.status === ResponseStatus.SUCCESS) {
                                    this.handleLoginSuccess(2);
                                    return;
                                }
                                this.store.dispatch(
                                    updateTapCardLogin({
                                        msgID: header?.msgID,
                                        payload: Object.assign({}, header, payload),
                                    }),
                                );
                                this.navigate(routerUrls?.private?.main?.tapCardLogin);
                            });
                            break;

                        case MsgID?.MANUAL_LOGIN_PIN:
                        case MsgID?.MANUAL_LOGIN_PIN2:
                        case MsgID?.MANUAL_LOGIN_STAFF_ID:
                        case MsgID?.MANUAL_LOGIN_DUTY:
                            currentManualPIN = this.messValidation(dateTime, currentManualPIN, () => {
                                this.store.dispatch(
                                    updateManualLogin({
                                        msgID: header?.msgID,
                                        payload: Object.assign({}, header, {
                                            ...payload,
                                            timeout: payload.timeout || undefined,
                                        }),
                                    }),
                                );
                                this.navigate(routerUrls?.private?.main?.manualLogin);
                            });
                            break;

                        case MsgID?.END_SHIFT:
                            currentEndShift = this.messValidation(dateTime, currentEndShift, () => {
                                if (payload?.status === ResponseStatus.SUCCESS) {
                                    this.navigate(routerUrls?.private?.main?.login);
                                    this.handleEndShiftSuccess();
                                    return;
                                }
                            });
                            break;

                        case MsgID.END_TRIP:
                            if (payload?.status === ResponseStatus.SUCCESS) {
                                this.store.dispatch(
                                    updateEndTripInfo({
                                        payload: {
                                            status: payload.status || 0,
                                            title: '',
                                            direction: '',
                                            service: 0,
                                            firstBusStop: {},
                                            lastBusStop: {},
                                            busStopList: [],
                                            reasonList: [],
                                            timeout: payload.timeout || undefined,
                                        },
                                        msgID: header?.msgID,
                                    }),
                                );
                                this.navigate(`/${routerUrls?.private?.main?.endTrip}`);
                            }
                            break;
                        case MsgID?.END_TRIP_TYPE:
                        case MsgID?.END_TRIP_SUBMIT:
                        case MsgID?.END_TRIP_SUBMIT_REASON:
                        case MsgID?.END_TRIP_SUBMIT_COMP_TICKET:
                        case MsgID?.END_TRIP_SUBMIT_BREAKDOWN_TICKET:
                            // case MsgID?.END_TRIP_REASON:
                            // case MsgID?.END_TRIP_BUS_STOP_LIST:
                            currentEndTrip = this.messValidation(dateTime, currentEndTrip, () => {
                                this.store.dispatch(
                                    updateEndTripInfo({
                                        msgID: header?.msgID,
                                        payload,
                                    }),
                                );
                                // this.navigate(routerUrls?.private?.main?.endTrip);
                            });
                            break;

                        case MsgID?.DECK_TYPE_LIST:
                        case MsgID?.DELETE_PARAMETER:
                            currentFareConsole = this.messValidation(dateTime, currentFareConsole, () => {
                                this.store.dispatch(
                                    updateFareConsole({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.COMMISSION_BUS_ID:
                        case MsgID?.COMMISSION_OPERATOR:
                        case MsgID?.COMMISSION_BUS_ID_SUBMIT:
                            currentBusId = this.messValidation(dateTime, currentBusId, () => {
                                this.store.dispatch(
                                    updateCommissionBusIdInformation({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.EXTERNAL_DEVICES:
                            currentExternalDevices = this.messValidation(dateTime, currentExternalDevices, () => {
                                this.store.dispatch(
                                    updateExternalDevices({
                                        payload,
                                        msgID: header?.msgID,
                                    }),
                                );
                            });
                            break;
                        case MsgID?.TEST_PRINT:
                            currentTestPrinter = this.messValidation(dateTime, currentTestPrinter, () => {
                                this.store.dispatch(
                                    updateTestPrinter({
                                        payload,
                                    }),
                                );
                            });
                            break;

                        // start trip flow:
                        case MsgID?.START_TRIP:
                            currentStartTrip = this.messValidation(dateTime, currentStartTrip, () => {
                                if (
                                    [
                                        StartTripTypes?.FMS_VALID_INFO,
                                        StartTripTypes?.FMS_TRIP_INFO_MISMATCH,
                                        StartTripTypes?.FMS_BUS_STOP_MISMATCH,
                                    ].includes(payload?.type)
                                ) {
                                    this.navigate(routerUrls?.private?.main?.busOperation?.startTripValidInfo);
                                    this.store.dispatch(
                                        updateStartTrip({
                                            payload: {
                                                fms: {
                                                    serviceNumber: payload?.serviceNumber,
                                                    busStop: payload?.busStop,
                                                    dir: payload?.dir,
                                                    variantName: payload?.variantName,
                                                },
                                                ...payload,
                                            },
                                            msgID: header?.msgID,
                                        }),
                                    );
                                } else if ([StartTripTypes?.FMS_NO_INFO].includes(payload?.type)) {
                                    this.navigate(routerUrls?.private?.main?.busOperation?.startTripInvalidInfo);
                                    // this.store.dispatch(
                                    //     updateStartTrip({
                                    //         payload,
                                    //         msgID: header?.msgID,
                                    //     }),
                                    // );
                                }
                            });
                            break;
                        case MsgID.START_TRIP_BUS_STOP_LIST:
                        case MsgID.START_TRIP_GET_SERVICE_LIST:
                            this.store.dispatch(
                                updateStartTrip({
                                    payload,
                                    msgID: header?.msgID,
                                }),
                            );
                            break;
                        case MsgID.START_TRIP_GET_FARE_TRIP_DETAILS:
                            this.store.dispatch(
                                updateStartTrip({
                                    payload: {
                                        fare: {
                                            ...payload,
                                        },
                                    },
                                    msgID: header?.msgID,
                                }),
                            );
                            break;
                        case MsgID.START_TRIP_SUBMIT_SERVICE:
                            this.store.dispatch(
                                updateStartTrip({
                                    payload: {
                                        status: payload?.status,
                                        dir: payload?.dir,
                                        variantName: payload?.variantName,
                                    },
                                    msgID: header?.msgID,
                                }),
                            );
                            break;
                        case MsgID.START_TRIP_SUBMIT_FARE_TRIP:
                            currentStartTrip = this.messValidation(dateTime, currentStartTrip, () => {
                                if (payload.status === ResponseStatus.SUCCESS) {
                                    // this.navigate(routerUrls?.private?.main?.busStopInformation);
                                    this.handleStartTripSuccess();
                                }
                            });
                            break;

                        case MsgID.LOCK:
                            currentLock = this.messValidation(dateTime, currentLock, () => {
                                if (payload.status === ResponseStatus.SUCCESS) {
                                    this.navigate(routerUrls?.private?.main?.lockScreen);
                                }
                            });
                            break;
                        case MsgID?.UNLOCK_SUBMIT:
                            currentLock = this.messValidation(dateTime, currentLock, () => {
                                this.store.dispatch(updateLockScreen({ payload, msgID: header?.msgID }));
                            });
                            break;

                        // main buttons flow
                        case MsgID.MAIN_FREE:
                            currentFreeMsg = this.messValidation(dateTime, currentFreeMsg, () => {
                                if (payload.status === ResponseStatus.SUCCESS) {
                                    this.navigate(routerUrls?.private?.main?.free);
                                }
                            });
                            break;
                        case MsgID.MAIN_FREE_SUBMIT:
                            currentFreeMsg = this.messValidation(dateTime, currentFreeMsg, () => {
                                if (payload.status === ResponseStatus.SUCCESS) {
                                    this.store.dispatch(updateFreeCVs({ payload: !this.freeMode }));
                                }
                                this.navigate(routerUrls?.private?.main?.busStopInformation);
                            });
                            break;

                        case MsgID.MAIN_FRONT_DOOR:
                            currentFrontDoorsMsg = this.messValidation(dateTime, currentFrontDoorsMsg, () => {
                                if (payload.status === ResponseStatus.SUCCESS) {
                                    this.navigate(routerUrls?.private?.main?.frontDoor);
                                }
                            });
                            break;
                        case MsgID.MAIN_FRONT_DOOR_CV1:
                        case MsgID.MAIN_FRONT_DOOR_CV2:
                            currentFrontDoorsMsg = this.messValidation(dateTime, currentFrontDoorsMsg, () => {
                                if (payload.status === ResponseStatus.SUCCESS) {
                                    const nextActiveCvs: number[] = [];
                                    this.cvLists = this?.cvLists?.map((_cv) => {
                                        const nextCv = { ..._cv };
                                        if (
                                            (header?.msgID === MsgID.MAIN_FRONT_DOOR_CV1 && nextCv.id === 1) ||
                                            (header?.msgID === MsgID.MAIN_FRONT_DOOR_CV2 && nextCv.id === 2)
                                        ) {
                                            nextCv.statuses = payload.statuses;
                                            nextActiveCvs.push(nextCv.id);
                                        }

                                        return nextCv;
                                    });
                                    this.store.dispatch(
                                        updateActiveCVs({
                                            payload: nextActiveCvs,
                                        }),
                                    );
                                    this.navigate(routerUrls?.private?.main?.busStopInformation);
                                }
                            });
                            break;
                        case MsgID.MAIN_REAR_DOORS:
                            currentRearDoorsMsg = this.messValidation(dateTime, currentRearDoorsMsg, () => {
                                if (payload.status === ResponseStatus.SUCCESS) {
                                    this.navigate(routerUrls?.private?.main?.rearDoor);
                                }
                            });
                            break;
                        case MsgID.MAIN_REAR_DOORS_SUBMIT:
                            currentRearDoorsMsg = this.messValidation(dateTime, currentRearDoorsMsg, () => {
                                if (payload.status === ResponseStatus.SUCCESS) {
                                    const nextActiveCvs: number[] = [];
                                    this.cvLists = this?.cvLists?.map((_cv) => {
                                        const nextCv = { ..._cv };
                                        const updatedCv = payload?.cvList?.find((item) => item.cvNumber === _cv.id);
                                        if (updatedCv) {
                                            nextCv.statuses = updatedCv.statuses;
                                            nextActiveCvs.push(nextCv.id);
                                        }
                                        return nextCv;
                                    });
                                    this.store.dispatch(
                                        updateActiveCVs({
                                            payload: nextActiveCvs,
                                        }),
                                    );
                                    this.navigate(routerUrls?.private?.main?.busStopInformation);
                                }
                            });
                            break;
                        case MsgID.MAIN_UP_DOWN_BTN:
                            currentUpDownButton = this.messValidation(dateTime, currentUpDownButton, () => {
                                if (payload['busStopId'])
                                    this.store.dispatch(
                                        updateCurrentFareBusStop({
                                            payload: payload['busStopId'],
                                            manualBls: payload?.manualBls,
                                            misMatch: payload?.misMatch,
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
                        case MsgID.MAIN_REDEEM:
                            currentRedeemMsg = this.messValidation(dateTime, currentRedeemMsg, () => {
                                if (payload.status === ResponseStatus.SUCCESS) {
                                    this.navigate(routerUrls?.private?.main?.redeem);
                                }
                            });
                            break;

                        case MsgID.BREAKDOWN:
                            currentBreakDown = this.messValidation(dateTime, currentBreakDown, () => {
                                if (payload?.status === ResponseStatus.SUCCESS) {
                                    this.store.dispatch(
                                        updateBreakDownInfo({
                                            payload: {
                                                status: 0,
                                                title: '',
                                                direction: '',
                                                service: 0,
                                                firstBusStop: {},
                                                lastBusStop: {},
                                                busStopList: [],
                                                reasonList: [],
                                            },
                                            msgID: undefined,
                                        }),
                                    );
                                    this.navigate(`/${routerUrls?.private?.main?.breakdown}`);
                                }
                            });

                            break;
                        case MsgID?.BREAKDOWN_TYPE:
                        case MsgID?.BREAKDOWN_SUBMIT:
                        case MsgID?.BREAKDOWN_SUBMIT_REASON:
                        case MsgID?.BREAKDOWN_SUBMIT_COMP_TICKET:
                        case MsgID?.BREAKDOWN_PROCESS_COMP_TICKET:
                        case MsgID?.BREAKDOWN_SUBMIT_BREAKDOWN_TICKET:
                        case MsgID?.BREAKDOWN_PROCESS_BREAKDOWN_TICKET:
                        case MsgID?.BREAKDOWN_BUS_STOP_LIST:
                        case MsgID?.BREAKDOWN_SUBMIT_WO_PRINT:
                            currentBreakDown = this.messValidation(dateTime, currentBreakDown, () => {
                                this.store.dispatch(
                                    updateBreakDownInfo({
                                        msgID: header?.msgID,
                                        payload,
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
            topic: topics.mainTab?.response,
            topicKey: TopicsKeys.MAIN_TAB,
        });

        // this.mqttService.publishWithFormat(topics.mainTab?.get, {
        //     requestType: MqttTypes?.FE_REQUEST,
        //     messageId: MessageId?.AUTH,
        // });

        //publish boot up message for the first time
        // this.mqttService.publishWithMessageFormat({
        //     topic: topics.mainTab?.get,
        //     msgID: MsgID.BOOT_UP,
        //     opts: { qos: 2 },
        // });
        // this.mqttSubscriptions.push(topics.mainTab?.get);
    }

    private handleLoginSuccess(loggedInType: number): void {
        const auth = { isLoggedIn: true, loggedInType };
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.maintenance?.response,
            msgID: MsgID.LOGIN_SUCCESS,
            msgSubID: MsgSubID.NOTIFY,
        });
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.fareTab?.response,
            msgID: MsgID.LOGIN_SUCCESS,
            msgSubID: MsgSubID.NOTIFY,
        });
        this.auth = { ...auth };
        this.localStorageService.setItem(LOCAL_STORAGE_KEY.AUTH, JSON.stringify(auth));
    }

    private handleEndShiftSuccess(): void {
        this.localStorageService.removeItem(LOCAL_STORAGE_KEY.AUTH);
        this.auth = { isLoggedIn: false, loggedInType: undefined };
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.fareTab?.response,
            msgID: MsgID.LOGOUT_SUCCESS,
            msgSubID: MsgSubID.NOTIFY,
        });
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.maintenance?.response,
            msgID: MsgID.LOGOUT_SUCCESS,
            msgSubID: MsgSubID.NOTIFY,
        });
    }

    private handleStartTripSuccess(): void {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.fareTab?.response,
            msgID: MsgID.START_TRIP_SUCCESS,
            msgSubID: MsgSubID.NOTIFY,
        });
        this.store.dispatch(
            updateIsOnTrip({
                payload: true,
            }),
        );
    }

    closePopUpHanlder() {
        this.showPop = null;
    }

    handleChangeCVIcons({ payload }) {
        const newList = this.cvLists?.filter((item) => payload?.cvNum === item.id);
        if (newList?.length === 0) return;
        const imgPath = payload.error ? '/error/' : '/';

        let imgName = '';
        switch (payload.icon) {
            case 1:
                imgName = 'workfare-icon';
                break;
            case 2:
                imgName = 'pwd';
                break;
            case 3:
                imgName = 'soldier-icon';
                break;
            case 4:
                imgName = 'student-icon';
                break;
            case 5:
                imgName = 'senior-icon';
                break;
            case 6:
                imgName = 'children-icon';
                break;
            case 7:
                imgName = 'staff-icon';
                break;
            case 8:
                imgName = 'workfare-icon';
                break;
        }

        newList[0].activeIcon = `/assets/images/icons/main${imgPath}${imgName}.svg`;
        newList[0].label = CVLabels[payload?.icon];
        newList[0].error = payload.error;
        newList[0].message = payload.message;

        // Clear previous timer and reset icon if necessary
        if (newList[0].timer) {
            clearTimeout(newList[0].timer as number);
            newList[0].timer = null;
        }

        // Set a timeout to reset icon and error after 3 seconds (or 30 seconds if error)
        newList[0].timer = setTimeout(
            () => {
                newList[0].activeIcon = null;
                newList[0].error = false;
                newList[0].message = undefined;
            },
            payload.error ? 30000 : 3000,
        );
    }

    initStore() {
        // combineLatest([this.busStopList$, this.fareBusStopList$])
        //     .pipe(
        //         takeUntil(this.destroy$),
        //         filter(([fareBusStopList, busStopList]) => fareBusStopList.length > 0 && busStopList.length > 0),
        //         take(1),
        //     )
        //     .subscribe(([busStopList, fareBusStopList]) => {
        //         if (!this.currentFareBusStop) {
        //             const fareBusStopActive = fareBusStopList?.find((item) => item?.flag == 'active');
        //             if (fareBusStopActive) {
        //                 this.store.dispatch(
        //                     updateCurrentFareBusStop({
        //                         payload: fareBusStopActive?.Busid,
        //                     }),
        //                 );
        //             }
        //         }

        //         // if (data?.fareBusStop) {
        //         //     this.store.dispatch(
        //         //         updateFareBusStop({
        //         //             payload: data?.fareBusStop,
        //         //         }),
        //         //     );
        //         // }
        //         // if (busStopList?.length > 0) {
        //         //     this.store.dispatch(
        //         //         updateCurrentNowDest({
        //         //             payload: {
        //         //                 ...(data?.now ? { now: data?.now } : {}),
        //         //                 ...(data?.dest ? { dest: data?.dest } : {}),
        //         //             },
        //         //         }),
        //         //     );
        //         // }
        //         // if (!this.isBusDirIndoSubscribed) {
        //         //     this.mqttService.subscribe({
        //         //         topic: this.topics?.busDirInfo?.response,
        //         //         callback: (message) => {
        //         //             const data = this.safeJsonService.safeParse(message);
        //         //             if (!data?.fareBusStop && !this.currentFareBusStop?.current) {
        //         //                 this.store.dispatch(
        //         //                     updateFareBusStop({
        //         //                         payload: fareBusStopList[0]?.Busid,
        //         //                     }),
        //         //                 );
        //         //             }
        //         //             if (data?.fareBusStop) {
        //         //                 this.store.dispatch(
        //         //                     updateFareBusStop({
        //         //                         payload: data?.fareBusStop,
        //         //                     }),
        //         //                 );
        //         //             }
        //         //             if (busStopList?.length > 0) {
        //         //                 this.store.dispatch(
        //         //                     updateCurrentNowDest({
        //         //                         payload: {
        //         //                             ...(data?.now ? { now: data?.now } : {}),
        //         //                             ...(data?.dest ? { dest: data?.dest } : {}),
        //         //                         },
        //         //                     }),
        //         //                 );
        //         //             }
        //         //         },
        //         //     });
        //         //     this.mqttSubscriptions.push(this.topics?.busDirInfo?.response);
        //         // }
        //     });

        this.fareBusStopList$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.fareBusStopList = data;

            if (!this.currentFareBusStop) {
                const fareBusStopActive = data?.find((item) => item?.flag == 'active');
                if (fareBusStopActive) {
                    this.store.dispatch(
                        updateCurrentFareBusStop({
                            payload: fareBusStopActive?.Busid,
                        }),
                    );
                }
            }
        });

        this.currentFareBusStop$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.currentFareBusStop = data;
            // console.log('currentFareBusStop', this.currentFareBusStop);
        });
        this.activeCVs$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            if (data.length > 0) {
                this.cvsActive = data;
                setTimeout(() => {
                    this.store.dispatch(updateActiveCVs({ payload: [] }));
                    this.cvsActive = [];
                }, 3000);
            }
        });
        this.freeMode$.pipe(takeUntil(this.destroy$)).subscribe((data: boolean) => {
            this.freeMode = data;
            this.setCvStatus();
        });
    }

    formatMainHeader(url) {
        return [
            this.loginUrl,
            this.tapCardLoginUrl,
            this.outOfServiceUrl,
            this.outOfServiceUrlNoData,
            this.busOperation,
            this.busOperationStartTrip,
            this.startTripInvalidInfo,
            this.commissioningInProgress,
            this.commissioningCompletedCleaning,
            this.commissioningClearingAllData,
            this.busOperationEndShift,
            this.busOperationExternalDevices,
            this.dagwOperationUrl,
        ]?.includes(url)
            ? url.substring(1)
            : 'main';
    }

    setCvStatus() {
        this.cvLists = this.cvLists?.map((_cv) => {
            const statuses = _cv?.statuses?.filter((_s) => _s !== CvStatusType.FREE);
            if (this.freeMode) {
                statuses.push(CvStatusType.FREE);
            }
            return {
                ..._cv,
                statuses,
            };
        });

        this.store.dispatch(updateActiveCVs({ payload: this.cvLists?.map((_cv) => _cv.id) }));
    }

    closeErrorCv(id: number) {
        const newList = [...this.cvLists]; // Create a shallow copy to avoid mutation
        const cv = newList[id - 1];

        if (cv.timer) {
            clearTimeout(cv.timer as number);
            cv.timer = null;
        }

        cv.error = false;
        cv.activeIcon = null;
        this.cvLists = newList;
    }

    navigate(route: string): void {
        this.router.navigate([`/${route}`]);
    }

    isRouteActive(route: string): boolean {
        return this.router.url === route;
    }

    updateLineActive(isUp: boolean): void {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.mainTab?.get,
            msgID: MsgID.MAIN_UP_DOWN_BTN,
            msgSubID: MsgSubID.REQUEST,
            payload: {
                btnControl: isUp ? 1 : -1,
            },
        });
        // if (this.currentFareBusStop) {
        //     if (this.currentFareBusStop?.prev && isUp) {
        //         this.store.dispatch(updateCurrentFareBusStop({ payload: this.currentFareBusStop?.prev }));
        //     }
        //     if (this.currentFareBusStop?.next && !isUp) {
        //         this.store.dispatch(updateCurrentFareBusStop({ payload: this.currentFareBusStop?.next }));
        //     }
        // } else {
        //     this.store.dispatch(updateCurrentFareBusStop({ payload: isUp ? 0 : -1 }));
        // }
    }

    handleClickMainButton(msgID: number) {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.mainTab?.get,
            msgID,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
    }

    handleIgnitionOff() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.mainTab?.get,
            msgID: MsgID.IGNITION_OFF,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });

        this.shuttingDownWarning = {
            ...this.shuttingDownWarning,
            disabled: true,
        };
    }

    handleTurnOffBusOfRoute() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.mainTab?.get,
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
            topic: this.topics.mainTab?.get,
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
        // Clear interval to stop updating current date
        clearInterval(this.intervalId);
        // Trigger unsubscription from all observables
        this.destroy$.next();
        this.destroy$.complete();

        // Unsubscribe from all MQTT topics using the unsubscribe method from MqttService
        if (this.mqttSubscriptions?.length > 0) {
            this.mqttSubscriptions.forEach((topic) => {
                this.mqttService.unsubscribe(topic?.topic, topic?.topicKey);
            });
        }
        // Ensure to clear any timeouts in MQTT subscriptions
        this.cvLists.forEach((cv) => {
            if (cv.timer) {
                clearTimeout(cv.timer as number);
            }
        });
    }
}
