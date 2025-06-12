import { Routes } from '@angular/router';
import { PageType, CvTypes, OutOfServiceType, StartTripTypes, CommissioningType } from '@models';
export const routerUrls = {
    private: {
        main: {
            url: 'main',
            login: 'main/login',
            commissioning: {
                inProgress: 'main/commissioning/in-progress',
                clearingAllData: 'main/commissioning/clearing-all-data',
                completedClearning: 'main/commissioning/completed-cleaning',
            },
            tapCardLogin: 'main/tap-card-login',
            manualLogin: 'main/manual-login',
            busStopInformation: 'main/bus-stop-information',
            frontExit: 'main/front-exit',
            cashPayment: 'main/cash-payment',
            frontDoor: 'main/front-door',
            rearDoor: 'main/rear-door',
            free: 'main/free',
            redeem: 'main/redeem',
            breakdown: 'main/breakdown',
            endTrip: 'main/end-trip',
            settings: 'main/settings',
            outOfServiceNoData: 'main/out-of-service/no-data',
            outOfService: 'main/out-of-service',
            languageSetting: 'main/language-setting',
            fareConsoleSetting: 'main/fare-console-setting',
            lockScreen: 'main/lock-screen',
            dagwOperation: 'main/dagw-operation',
            busStopFare: (id?: string) => (id ? `main/bus-stop-fare/${id}` : 'main/bus-stop-fare/:busStopId'),
            busOperation: {
                url: 'main/bus-operation',
                startTripValidInfo: 'main/bus-operation/start-trip',
                // startTripConnectedPro: 'main/bus-operation/start-trip/connected-productive',
                endShift: 'main/bus-operation/end-shift',
                startTripInvalidInfo: 'main/bus-operation/start-trip/invalid-info',
                externalDevices: 'main/bus-operation/external-devices',
            },
        },
        busOperation: {
            url: 'bus-operation',
            externalDevices: 'bus-operation/external-devices',
            endShift: 'bus-operation/end-shift',
        },
        fare: {
            url: 'fare',
            topUp: 'fare/top-up',
            transaction: 'fare/transaction',
            cancelRideCV1: 'fare/cancel-ride-cv1',
            cancelRideCV2: 'fare/cancel-ride-cv2',
            concessionCV1: 'fare/concession-cv1',
            concessionCV2: 'fare/concession-cv2',
            cvOperation: {
                url: 'fare/cv-operation',
                showCVStatus: 'fare/cv-operation/show-cv-status',
                setCV: 'fare/cv-operation/set-cv',
                cvModeControl: 'fare/cv-operation/cv-mode-control',
                powerAllCVOn: 'fare/cv-operation/power-all-cv-on',
                powerAllCVOff: 'fare/cv-operation/power-all-cv-off',
                cvPowerControl: 'fare/cv-operation/cv-power-control',
                resetAllCV: 'fare/cv-operation/reset-all-cv',
            },
            blsOperation: {
                url: 'fare/bls-operation',
                manualLocation: 'fare/bls-operation/manual-location',
                autoLocation: 'fare/bls-operation/auto-location',
            },
            printerOperation: {
                url: 'fare/printer-operation',
                inspectorTicket: 'fare/printer-operation/inspector-ticket',
                dailyTripLog: 'fare/printer-operation/daily-trip-log',
                testReceipt: 'fare/printer-operation/test-receipt',
                retentionTicket: 'fare/printer-operation/retention-ticket',
                printerOn: 'fare/printer-operation/printer-on',
                printerOff: 'fare/printer-operation/printer-off',
                status: 'fare/printer-operation/status',
            },
            // deviceOperation: {
            //     url: 'fare/device-operation',
            //     cv: {
            //         url: 'fare/device-operation/cv',
            //         showCVStatus: 'fare/device-operation/cv/show-cv-status',
            //         setCV: 'fare/device-operation/cv/set-cv',
            //         cvModeControl: 'fare/device-operation/cv/cv-mode-control',
            //         powerAllCVOn: 'fare/device-operation/cv/power-all-cv-on',
            //         powerAllCVOff: 'fare/device-operation/cv/power-all-cv-off',
            //         cvPowerControl: 'fare/device-operation/cv/cv-power-control',
            //         resetAllCV: 'fare/device-operation/cv/reset-all-cv',
            //     },
            //     bls: {
            //         url: 'fare/device-operation/bls',
            //         manualLocation: 'fare/device-operation/bls/manual-location',
            //         autoLocation: 'fare/device-operation/bls/auto-location',
            //     },
            //     printer: {
            //         url: 'fare/device-operation/printer',
            //         inspectorTicket: 'fare/device-operation/printer/inspector-ticket',
            //         dailyTripLog: 'fare/device-operation/printer/daily-trip-log',
            //         testReceipt: 'fare/device-operation/printer/test-receipt',
            //         retentionTicket: 'fare/device-operation/printer/retention-ticket',
            //         printerOn: 'fare/device-operation/printer/printer-on',
            //         printerOff: 'fare/device-operation/printer/printer-off',
            //         status: 'fare/device-operation/printer/status',
            //     },
            // },
        },
        fms: {
            url: 'fms',
        },
        maintenance: {
            url: 'maintenance',
            fare: {
                url: 'maintenance/fare',
                appUpgrade: 'maintenance/fare/application-upgrade',
                viewParameter: 'maintenance/fare/view-parameter',
                blsInformation: 'maintenance/fare/bls-information',
                calibrateBLS: {
                    url: 'maintenance/fare/calibrate-bls',
                    calibrateBlsManualInput: 'maintenance/fare/calibrate-bls/manual-input',
                    calibrateBlsCalibration: 'maintenance/fare/calibrate-bls/bls-calibration',
                },
                changeWlanKey: 'maintenance/fare/change-wlan-key',
                checkPrinter: 'maintenance/fare/check-printer',
                displayAudit: 'maintenance/fare/display-audit',
                gyroSwitch: 'maintenance/fare/gyro-switch',
                loadParameter: 'maintenance/fare/load-parameter',
                printBcvResult: 'maintenance/fare/print-bcv-result',
                redetectBls: 'maintenance/fare/redetect-bls',
                redetectCrp: 'maintenance/fare/redetect-crp',
                redetectCv: 'maintenance/fare/redetect-cv',
                redetectFms: 'maintenance/fare/redetect-fms',
                resetBls: 'maintenance/fare/reset-bls',
                saveTransaction: 'maintenance/fare/save-transaction',
                testPrint: 'maintenance/fare/test-print',
                versionInfo: 'maintenance/fare/version-info',
                externalDevices: 'maintenance/fare/external-devices',
                ticketingConsole: {
                    url: 'maintenance/fare/fare-console',
                    deckType: 'maintenance/fare/fare-console/deck-type',
                    blsSetting: 'maintenance/fare/fare-console/bls',
                    timeSetting: 'maintenance/fare/fare-console/time-setting',
                    dateSetting: 'maintenance/fare/fare-console/date-setting',
                    busId: 'maintenance/fare/fare-console/bus-id',
                    complimentaryDay: 'maintenance/fare/fare-console/complimentary-day',
                    deleteParameter: 'maintenance/fare/fare-console/delete-parameter',
                },
            },
            cjb: {
                url: 'maintenance/cjb',
            },
        },
        logOut: {
            url: 'log-out',
        },
    },
    public: {
        signIn: 'sign-in',
        welcome: 'welcome',
        mqtt: 'mqtt',
    },
};

export const nestedUrlHandler = (url, textToRemove) => url?.replace(textToRemove, '');

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
    },
    {
        path: routerUrls?.public?.signIn,
        loadComponent: () => import('@views/sign-in/sign-in.component').then((m) => m.SignInComponent),
    },
    {
        path: routerUrls?.public?.welcome,
        loadComponent: () => import('@views/welcome/welcome.component').then((m) => m.WelcomeComponent),
    },
    {
        path: routerUrls?.public?.mqtt,
        loadComponent: () => import('@views/mqtt/mqtt.component').then((m) => m.MqttComponent),
    },
    {
        path: '',
        loadComponent: () => import('@components/layout/layout.component').then((m) => m.LayoutComponent),
        // canActivate: [AuthGuard],
        children: [
            {
                path: routerUrls?.private?.main?.url,
                loadComponent: () => import('@views/main/main-layout/main.component').then((m) => m.MainComponent),
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('@app/views/main/boot-up/boot-up.component').then((m) => m.BootUpComponent),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.busOperation?.url,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import(
                                '@app/views/main/bus-operation/bus-operation-menu/bus-operation-menu.component'
                            ).then((m) => m.BusOperationMenuComponent),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.commissioning?.inProgress,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/boot-up-commissioning/boot-up-commissioning.component').then(
                                (m) => m.BootUpCommissioningComponent,
                            ),
                        data: {
                            pageType: CommissioningType?.IN_PROGRESS,
                        },
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.commissioning?.clearingAllData,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/boot-up-commissioning/boot-up-commissioning.component').then(
                                (m) => m.BootUpCommissioningComponent,
                            ),
                        data: {
                            pageType: CommissioningType?.CLEARING_ALL_DATA,
                        },
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.commissioning?.completedClearning,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/boot-up-commissioning/boot-up-commissioning.component').then(
                                (m) => m.BootUpCommissioningComponent,
                            ),
                        data: {
                            pageType: CommissioningType?.COMPLETED_CLEANING,
                        },
                    },
                    // {
                    //     path: nestedUrlHandler(
                    //         routerUrls?.private?.main?.busOperation?.startTripConnectedPro,
                    //         `${routerUrls?.private?.main?.url}/`,
                    //     ),
                    //     loadComponent: () =>
                    //         import('@app/views/main/bus-operation/start-trip/start-trip.component').then(
                    //             (m) => m.StartTripComponent,
                    //         ),
                    //     data: {
                    //         pageType: TripDetailsType?.FMS_VALID_INFO,
                    //     },
                    // },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.busOperation?.startTripValidInfo,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/bus-operation/start-trip/start-trip.component').then(
                                (m) => m.StartTripComponent,
                            ),
                        data: {
                            pageType: StartTripTypes?.FMS_VALID_INFO,
                        },
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.busOperation?.startTripInvalidInfo,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import(
                                '@app/views/main/bus-operation/start-trip-details-issue/start-trip-details-issue.component'
                            ).then((m) => m.StartTripDetailsIssueComponent),
                    },

                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.busOperation?.endShift,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/bus-operation/end-shift/end-shift.component').then(
                                (m) => m.EndShiftComponent,
                            ),
                    },

                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.busOperation?.externalDevices,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/bus-operation/external-devices/external-devices.component').then(
                                (m) => m.ExternalDevicesComponent,
                            ),
                    },

                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.languageSetting,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/language-setting/language-setting.component').then(
                                (m) => m.LanguageSettingComponent,
                            ),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.fareConsoleSetting,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/fare-console-setting/fare-console-setting.component').then(
                                (m) => m.FareConsoleSettingComponent,
                            ),
                        data: {
                            pageType: OutOfServiceType?.WITH_INFO,
                        },
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.outOfService,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/out-of-service/out-of-service.component').then(
                                (m) => m.OutOfServiceComponent,
                            ),
                        data: {
                            pageType: OutOfServiceType?.WITH_INFO,
                        },
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.outOfServiceNoData,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/out-of-service/out-of-service.component').then(
                                (m) => m.OutOfServiceComponent,
                            ),
                        data: {
                            pageType: OutOfServiceType?.NO_DATA,
                        },
                    },

                    {
                        path: nestedUrlHandler(routerUrls?.private?.main?.login, `${routerUrls?.private?.main?.url}/`),
                        loadComponent: () =>
                            import('@app/views/main/login/login.component').then((m) => m.LoginComponent),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.tapCardLogin,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/login-tap-card/login-tap-card.component').then(
                                (m) => m.LoginTapCardComponent,
                            ),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.manualLogin,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/login-manual/login-manual.component').then(
                                (m) => m.LoginManualComponent,
                            ),
                    },

                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.busStopInformation,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/bus-stop/bus-stop-information.component').then(
                                (m) => m.BusStopInformationComponent,
                            ),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.settings,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@views/main/settings/settings.component').then((m) => m.SettingsComponent),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.frontExit,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@views/main/front-exit/front-exit.component').then((m) => m.FrontExitComponent),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.cashPayment,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@views/main/cash-payment/cash-payment.component').then(
                                (m) => m.CashPaymentComponent,
                            ),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.frontDoor,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/front-door/front-door.component').then((m) => m.FrontDoorComponent),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.rearDoor,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/main/rear-door/rear-door.component').then((m) => m.RearDoorComponent),
                    },
                    {
                        path: nestedUrlHandler(routerUrls?.private?.main?.free, `${routerUrls?.private?.main?.url}/`),
                        loadComponent: () => import('@views/main/free/free.component').then((m) => m.FreeComponent),
                    },
                    {
                        path: nestedUrlHandler(routerUrls?.private?.main?.redeem, `${routerUrls?.private?.main?.url}/`),
                        loadComponent: () =>
                            import('@views/main/redeem/redeem.component').then((m) => m.RedeemComponent),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.breakdown,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@views/main/breakdown/breakdown.component').then((m) => m.BreakdownComponent),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.endTrip,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@views/main/end-trip/end-trip.component').then((m) => m.EndTripComponent),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.lockScreen,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@views/main/lock-screen/lock-screen.component').then((m) => m.LockScreenComponent),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.busStopFare(),
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@views/main/bus-stop-fare/bus-stop-fare.component').then(
                                (m) => m.BusStopFareComponent,
                            ),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.main?.dagwOperation,
                            `${routerUrls?.private?.main?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@views/main/dagw-operation/dagw-operation.component').then(
                                (m) => m.DagwOperationComponent,
                            ),
                    },
                ],
            },

            {
                path: routerUrls?.private?.fare?.url,
                loadComponent: () =>
                    import('@app/views/fare/layout/layout.component').then((m) => m.FareLayoutComponent),
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('@app/views/fare/ticketing-menu/ticketing-menu.component').then(
                                (m) => m.TicketingMenuComponent,
                            ),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.fare?.transaction,
                            `${routerUrls?.private?.fare?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/fare/transaction/transaction.component').then(
                                (m) => m.TransactionComponent,
                            ),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.fare?.cancelRideCV1,
                            `${routerUrls?.private?.fare?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/fare/cancel-ride/cancel-ride.component').then(
                                (m) => m.CancelRideComponent,
                            ),
                        data: {
                            pageType: PageType?.CANCEL,
                            cvType: CvTypes?.CV1,
                        },
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.fare?.cancelRideCV2,
                            `${routerUrls?.private?.fare?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@app/views/fare/cancel-ride/cancel-ride.component').then(
                                (m) => m.CancelRideComponent,
                            ),
                        data: {
                            pageType: PageType?.CANCEL,
                            cvType: CvTypes?.CV2,
                        },
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.fare?.concessionCV1,
                            `${routerUrls?.private?.fare?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@views/fare/concession/concession.component').then((m) => m.ConcessionComponent),
                        data: {
                            cvType: CvTypes?.CV1,
                        },
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.fare?.concessionCV2,
                            `${routerUrls?.private?.fare?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@views/fare/concession/concession.component').then((m) => m.ConcessionComponent),
                        data: {
                            cvType: CvTypes?.CV2,
                        },
                    },
                    {
                        path: nestedUrlHandler(routerUrls?.private?.fare?.topUp, `${routerUrls?.private?.fare?.url}/`),
                        loadComponent: () =>
                            import('@app/views/fare/top-up/top-up.component').then((m) => m.TopUpComponent),
                    },

                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.fare?.cvOperation?.url,
                            `${routerUrls?.private?.fare?.url}/`,
                        ),
                        loadComponent: () =>
                            import(
                                '@app/views/fare/cv-operation/cv-operation-layout/cv-operation-layout.component'
                            ).then((m) => m.CVOperationLayoutComponent),
                        data: { rootRoute: '/fare/cv-operation', breadcrumb: 'FARE_SYSTEM' },
                        children: [
                            {
                                path: '',
                                data: { rootRoute: '/fare', breadcrumb: 'CV_OPERATIONS' },
                                children: [
                                    {
                                        path: '',
                                        loadComponent: () =>
                                            import(
                                                '@app/views/fare/cv-operation/cv-operation-menu/cv-operation-menu.component'
                                            ).then((m) => m.CVOperationMenuComponent),
                                        data: { rootRoute: '/fare', breadcrumb: '' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.fare?.cvOperation?.showCVStatus,
                                            `${routerUrls?.private?.fare?.cvOperation?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/fare/cv-operation/show-cv-status/show-cv-status.component'
                                            ).then((m) => m.ShowCVStatusComponent),
                                        data: { rootRoute: '/fare', breadcrumb: 'SHOW_CV_STATUS' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.fare?.cvOperation?.setCV,
                                            `${routerUrls?.private?.fare?.cvOperation?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/fare/cv-operation/set-cv-entry-exit/set-cv-entry-exit.component'
                                            ).then((m) => m.SetCVEntryExitComponent),
                                        data: { rootRoute: '/fare', breadcrumb: 'SET_SV_ENTRY_EXIT' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.fare?.cvOperation?.cvModeControl,
                                            `${routerUrls?.private?.fare?.cvOperation?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/fare/cv-operation/cv-mode-control/cv-mode-control.component'
                                            ).then((m) => m.CVModeControlComponent),
                                        data: { rootRoute: '/fare', breadcrumb: 'CV_MODE_CONTROL' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.fare?.cvOperation?.powerAllCVOn,
                                            `${routerUrls?.private?.fare?.cvOperation?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/fare/cv-operation/power-all-cv-on/power-all-cv-on.component'
                                            ).then((m) => m.PowerAllCVOnComponent),
                                        data: { rootRoute: '/fare', breadcrumb: 'POWER_ALL_CV_ON' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.fare?.cvOperation?.powerAllCVOff,
                                            `${routerUrls?.private?.fare?.cvOperation?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/fare/cv-operation/power-all-cv-off/power-all-cv-off.component'
                                            ).then((m) => m.PowerAllCVOffComponent),
                                        data: { rootRoute: '/fare', breadcrumb: 'POWER_ALL_CV_OFF' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.fare?.cvOperation?.cvPowerControl,
                                            `${routerUrls?.private?.fare?.cvOperation?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/fare/cv-operation/cv-power-control/cv-power-control.component'
                                            ).then((m) => m.CVPowerControlComponent),
                                        data: { rootRoute: '/fare', breadcrumb: 'CV_POWER_CONTROL' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.fare?.cvOperation?.resetAllCV,
                                            `${routerUrls?.private?.fare?.cvOperation?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import('@views/fare/cv-operation/reset-all-cv/reset-all-cv.component').then(
                                                (m) => m.ResetAllCVComponent,
                                            ),
                                        data: { rootRoute: '/fare', breadcrumb: 'RESET_ALL_CV' },
                                    },
                                ],
                            },
                        ],
                    },

                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.fare?.blsOperation?.url,
                            `${routerUrls?.private?.fare?.url}/`,
                        ),
                        loadComponent: () =>
                            import(
                                '@app/views/fare/bls-operation/bls-operation-layout/bls-operation-layout.component'
                            ).then((m) => m.BLSOperationLayoutComponent),
                        data: { rootRoute: '/fare/bls-operation', breadcrumb: 'FARE_SYSTEM' },
                        children: [
                            {
                                path: '',
                                data: { rootRoute: '/fare', breadcrumb: 'BLS_OPERATIONS' },
                                children: [
                                    {
                                        path: '',
                                        loadComponent: () =>
                                            import(
                                                '@app/views/fare/bls-operation/bls-operation-menu/bls-operation-menu.component'
                                            ).then((m) => m.BLSOperationMenuComponent),
                                        data: { rootRoute: '/fare', breadcrumb: '' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.fare?.blsOperation?.manualLocation,
                                            `${routerUrls?.private?.fare?.blsOperation?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/fare/bls-operation/manual-location/manual-location.component'
                                            ).then((m) => m.ManualLocationComponent),
                                        data: { rootRoute: '/fare', breadcrumb: 'MANUAL_LOCATION' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.fare?.blsOperation?.autoLocation,
                                            `${routerUrls?.private?.fare?.blsOperation?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/fare/bls-operation/auto-location/auto-location.component'
                                            ).then((m) => m.AutoLocationComponent),
                                        data: { rootRoute: '/fare', breadcrumb: 'AUTO_LOCATION' },
                                    },
                                ],
                            },
                        ],
                    },

                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.fare?.printerOperation?.url,
                            `${routerUrls?.private?.fare?.url}/`,
                        ),
                        loadComponent: () =>
                            import(
                                '@app/views/fare/printer-operation/printer-operation-layout/printer-operation-layout.component'
                            ).then((m) => m.PrinterOperationLayoutComponent),
                        data: { rootRoute: '/fare/printer-operation', breadcrumb: 'FARE_SYSTEM' },
                        children: [
                            {
                                path: '',
                                data: { rootRoute: '/fare', breadcrumb: 'PRINTER_OPERATIONS' },
                                children: [
                                    {
                                        path: '',
                                        loadComponent: () =>
                                            import(
                                                '@app/views/fare/printer-operation/printer-operation-menu/printer-operation-menu.component'
                                            ).then((m) => m.PrinterOperationMenuComponent),
                                        data: { rootRoute: '/fare', breadcrumb: '' },
                                    },
                                    // {
                                    //     path: nestedUrlHandler(
                                    //         routerUrls?.private?.fare?.printerOperation?.inspectorTicket,
                                    //         `${routerUrls?.private?.fare?.printerOperation?.url}/`,
                                    //     ),
                                    //     loadComponent: () =>
                                    //         import(
                                    //             '@views/fare/printer-operation/inspector-ticket/inspector-ticket.component'
                                    //         ).then((m) => m.InspectorTicketComponent),
                                    //     data: { rootRoute: '/fare', breadcrumb: 'MANUAL_LOCATION' },
                                    // },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.fare?.printerOperation?.retentionTicket,
                                            `${routerUrls?.private?.fare?.printerOperation?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@app/views/fare/printer-operation/retention-ticket/retention-ticket.component'
                                            ).then((m) => m.PrintRetentionTicket),
                                        data: { rootRoute: '/fare', breadcrumb: 'RETENTION_TICKET' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.fare?.printerOperation?.status,
                                            `${routerUrls?.private?.fare?.printerOperation?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/fare/printer-operation/printer-status/printer-status.component'
                                            ).then((m) => m.PrinterStatusComponent),
                                        data: { rootRoute: '/fare', breadcrumb: 'PRINT_STATUS' },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },

            {
                path: routerUrls?.private?.fms?.url,
                loadComponent: () => import('@views/fms/fms.component').then((m) => m.FMSComponent),
            },
            {
                path: routerUrls?.private?.maintenance?.url,
                loadComponent: () =>
                    import('@views/maintenance/layout/layout.component').then((m) => m.MaintenanceLayoutComponent),
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('@views/maintenance/maintenance-menu/maintenance-menu.component').then(
                                (m) => m.MaintenanceMenuComponent,
                            ),
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.maintenance?.fare?.url,
                            `${routerUrls?.private?.maintenance?.url}/`,
                        ),
                        loadComponent: () =>
                            import('@views/maintenance/fare/layout/layout.component').then(
                                (m) => m.FareLayoutComponent,
                            ),
                        data: { rootRoute: '/maintenance/fare', breadcrumb: 'MAINTENANCE' },
                        children: [
                            {
                                path: '',
                                loadComponent: () =>
                                    import('@views/maintenance/fare/view-parameter/view-parameter.component').then(
                                        (m) => m.ViewParameterComponent,
                                    ),
                                data: { rootRoute: '/maintenance', breadcrumb: 'VIEW_PARAMETER' },
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.viewParameter,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import('@views/maintenance/fare/view-parameter/view-parameter.component').then(
                                        (m) => m.ViewParameterComponent,
                                    ),
                                data: { rootRoute: '/maintenance', breadcrumb: 'VIEW_PARAMETER' },
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.appUpgrade,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import(
                                        '@views/maintenance/fare/application-upgrade/application-upgrade.component'
                                    ).then((m) => m.ApplicationUpgrade),
                                data: { rootRoute: '/maintenance', breadcrumb: 'APPLICATION_UPGRADE' },
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.blsInformation,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import('@views/maintenance/fare/bls-information/bls-information.component').then(
                                        (m) => m.BLSInformationComponent,
                                    ),
                                data: { rootRoute: '/maintenance', breadcrumb: 'BLS_INFORMATION' },
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.calibrateBLS?.url,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import(
                                        '@views/maintenance/fare/calibrate-bls/calibrate-bls-layout/calibrate-bls-layout.component'
                                    ).then((m) => m.CalibrateBLSLayoutComponent),
                                data: { rootRoute: '/maintenance', breadcrumb: 'CALIBRATE_BLS' },
                                children: [
                                    {
                                        path: '',
                                        loadComponent: () =>
                                            import(
                                                '@views/maintenance/fare/calibrate-bls/calibrate-bls-menu/calibrate-bls-menu.component'
                                            ).then((m) => m.CalibrateBLSMenuComponent),
                                        data: { rootRoute: '/maintenance', breadcrumb: '' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.maintenance?.fare?.calibrateBLS
                                                ?.calibrateBlsManualInput,
                                            `${routerUrls?.private?.maintenance?.fare?.calibrateBLS?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/maintenance/fare/calibrate-bls/calibrate-bls-manual-input/calibrate-bls-manual-input.component'
                                            ).then((m) => m.CalibrateBLSManualInputComponent),
                                        data: { rootRoute: '/maintenance', breadcrumb: 'Manual Input' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.maintenance?.fare?.calibrateBLS
                                                ?.calibrateBlsCalibration,
                                            `${routerUrls?.private?.maintenance?.fare?.calibrateBLS?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/maintenance/fare/calibrate-bls/calibrate-bls-calibration/calibrate-bls-calibration.component'
                                            ).then((m) => m.CalibrateBLSCalibrationComponent),
                                        data: { rootRoute: '/maintenance', breadcrumb: 'BLS Calibration' },
                                    },
                                ],
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.displayAudit,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import('@views/maintenance/fare/display-audit/display-audit.component').then(
                                        (m) => m.DisplayAuditComponent,
                                    ),
                                data: { rootRoute: '/maintenance', breadcrumb: 'DISPLAY_AUDIT' },
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.loadParameter,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import('@views/maintenance/fare/load-parameter/load-parameter.component').then(
                                        (m) => m.LoadParameterComponent,
                                    ),
                                data: { rootRoute: '/maintenance', breadcrumb: 'LOAD_PARAMETERS' },
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.printBcvResult,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import('@views/maintenance/fare/print-bcv-result/print-bcv-result.component').then(
                                        (m) => m.PrintBcvResultComponent,
                                    ),
                                data: { rootRoute: '/maintenance', breadcrumb: 'PRINT_CV_RESULTS' },
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.redetectCrp,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import('@views/maintenance/fare/redetect-crp/redetect-crp.component').then(
                                        (m) => m.RedetectCRPComponent,
                                    ),
                                data: { rootRoute: '/maintenance', breadcrumb: 'REDETECT_CRP' },
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.redetectCv,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import('@views/maintenance/fare/redetect-cv/redetect-cv.component').then(
                                        (m) => m.RedetectCVComponent,
                                    ),
                                data: { rootRoute: '/maintenance', breadcrumb: 'REDETECT_CV' },
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.redetectFms,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import('@views/maintenance/fare/redetect-fms/redetect-fms.component').then(
                                        (m) => m.RedetectFMSComponent,
                                    ),
                                data: { rootRoute: '/maintenance', breadcrumb: 'REDETECT_FMS' },
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.saveTransaction,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import('@views/maintenance/fare/save-transaction/save-transaction.component').then(
                                        (m) => m.SaveTransactionComponent,
                                    ),
                                data: { rootRoute: '/maintenance', breadcrumb: 'SAVE_TRANSACTION' },
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.testPrint,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import('@views/maintenance/fare/test-print/test-print.component').then(
                                        (m) => m.TestPrintComponent,
                                    ),
                                data: { rootRoute: '/maintenance', breadcrumb: 'CHECK_TEST_PRINTER' },
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.versionInfo,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import('@views/maintenance/fare/version-info/version-info.component').then(
                                        (m) => m.VersionInfoComponent,
                                    ),
                                data: { rootRoute: '/maintenance', breadcrumb: 'VERSION_INFO' },
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.externalDevices,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import('@views/maintenance/fare/external-devices/external-devices.component').then(
                                        (m) => m.ExternalDevicesComponent,
                                    ),
                                data: { rootRoute: '/maintenance', breadcrumb: 'EXTERNAL_DEVICES' },
                            },
                            {
                                path: nestedUrlHandler(
                                    routerUrls?.private?.maintenance?.fare?.ticketingConsole?.url,
                                    `${routerUrls?.private?.maintenance?.fare?.url}/`,
                                ),
                                loadComponent: () =>
                                    import('@views/maintenance/fare/fare-console/layout/layout.component').then(
                                        (m) => m.FareConsoleLayoutComponent,
                                    ),
                                data: { rootRoute: '/maintenance', breadcrumb: 'CONFIGURE_FARE_CONSOLE' },
                                children: [
                                    {
                                        path: '',
                                        loadComponent: () =>
                                            import(
                                                '@views/maintenance/fare/fare-console/fare-console-table/fare-console-table.component'
                                            ).then((m) => m.FareConsoleTableComponent),
                                        data: { rootRoute: '/maintenance', breadcrumb: '' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.maintenance?.fare?.ticketingConsole?.deckType,
                                            `${routerUrls?.private?.maintenance?.fare?.ticketingConsole?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/maintenance/fare/fare-console/deck-type/deck-type.component'
                                            ).then((m) => m.DeckTypeComponent),
                                        data: { rootRoute: '/maintenance', breadcrumb: 'Deck Type' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.maintenance?.fare?.ticketingConsole?.blsSetting,
                                            `${routerUrls?.private?.maintenance?.fare?.ticketingConsole?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import('@views/maintenance/fare/fare-console/bls/bls.component').then(
                                                (m) => m.BLSStatusComponent,
                                            ),
                                        data: { rootRoute: '/maintenance', breadcrumb: 'BLS Status' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.maintenance?.fare?.ticketingConsole?.timeSetting,
                                            `${routerUrls?.private?.maintenance?.fare?.ticketingConsole?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/maintenance/fare/fare-console/time-setting/time-setting.component'
                                            ).then((m) => m.TimeSettingComponent),
                                        data: { rootRoute: '/maintenance', breadcrumb: 'Time' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.maintenance?.fare?.ticketingConsole?.dateSetting,
                                            `${routerUrls?.private?.maintenance?.fare?.ticketingConsole?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/maintenance/fare/fare-console/date-setting/date-setting.component'
                                            ).then((m) => m.DateSettingComponent),
                                        data: { rootRoute: '/maintenance', breadcrumb: 'Date' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.maintenance?.fare?.ticketingConsole?.busId,
                                            `${routerUrls?.private?.maintenance?.fare?.ticketingConsole?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import('@views/maintenance/fare/fare-console/bus-id/bus-id.component').then(
                                                (m) => m.BusIdComponent,
                                            ),
                                        data: { rootRoute: '/maintenance', breadcrumb: 'Bus ID' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.maintenance?.fare?.ticketingConsole?.complimentaryDay,
                                            `${routerUrls?.private?.maintenance?.fare?.ticketingConsole?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/maintenance/fare/fare-console/complimentary-day/complimentary-day.component'
                                            ).then((m) => m.ComplimentaryDayComponent),
                                        data: { rootRoute: '/maintenance', breadcrumb: 'Complimentary Days' },
                                    },
                                    {
                                        path: nestedUrlHandler(
                                            routerUrls?.private?.maintenance?.fare?.ticketingConsole?.deleteParameter,
                                            `${routerUrls?.private?.maintenance?.fare?.ticketingConsole?.url}/`,
                                        ),
                                        loadComponent: () =>
                                            import(
                                                '@views/maintenance/fare/fare-console/delete-parameter/delete-parameter.component'
                                            ).then((m) => m.DeleteParameterComponent),
                                        data: { rootRoute: '/maintenance', breadcrumb: 'Delete Parameters' },
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: nestedUrlHandler(
                            routerUrls?.private?.maintenance?.cjb?.url,
                            `${routerUrls?.private?.maintenance?.url}/`,
                        ),
                        loadComponent: () => import('@views/maintenance/cjb/cjb.component').then((m) => m.CJBComponent),
                        data: { breadcrumb: 'MAINTENANCE' },
                    },
                ],
            },

            {
                path: routerUrls?.private?.logOut?.url,
                loadComponent: () => import('@views/log-out/log-out.component').then((m) => m.LogOutComponent),
            },
        ],
    },
    { path: '**', redirectTo: '/main' },
];
