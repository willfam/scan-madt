import { createReducer, on, createSelector } from '@ngrx/store';
import {
    updateCurrentFareBusStop,
    selectBusStop,
    selectBusStopForFare,
    updateActiveCVs,
    updateFreeCVs,
    updateUserInfo,
    updateBusStopList,
    updateCurrentNowDest,
    updateDeviation,
    updateNextBusInfo,
    updateBootUp,
    updateFareConsole,
    updateOutOfService,
    updateCvUpgradeStatus,
    updateDagwOperation,
    updateTapCardLogin,
    updateManualLogin,
    updateEndTripInfo,
    updateBreakDownInfo,
    updateCommissionBusIdInformation,
    updateExternalDevices,
    updateTestPrinter,
    updateLanguage,
    updateStartTrip,
    updateLockScreen,
} from './main.action';
import { AppState } from '@store/app.state';
import {
    IFmsBusStop,
    ICurrenNowDest,
    IUserInfoMain,
    ICurrentFareBusStop,
    IDeviation,
    INextBusInfo,
    ICvsStatus,
    IBootUp,
    IFareConsole,
    IOutOfService,
    IDagwOperation,
    ITapCardLogin,
    IManualLogin,
    IEndTrip,
    IBreakDown,
    IBusID,
    IExternalDevice,
    IStartTrip,
    ILockScreen,
    IFareBusStop,
} from '@models';

export interface MainState {
    activeCVs: number[];
    freeMode: boolean;
    currentFareBusStop: IFareBusStop | null;
    busStopList: IFmsBusStop[];
    fareBusStopList: IFareBusStop[];
    selectedBusStop: IFmsBusStop | null;
    busStopFareId: string;
    userInfo: IUserInfoMain;
    currentDir: ICurrenNowDest;
    deviation: IDeviation;
    nextBusInfo: INextBusInfo;
    cvIconStatus: ICvsStatus[];
    bootUp: IBootUp;
    fareConsole: IFareConsole;
    outOfService: IOutOfService;
    dagwOperation: IDagwOperation;
    tapCardLogin: ITapCardLogin;
    manualLogin: IManualLogin;
    endTripInfo: IEndTrip;
    breakDownInfo: IBreakDown;
    cmBusIdInformation: IBusID;
    externalDevices: IExternalDevice;
    language: string;
    startTrip: IStartTrip;
    lockScreen: ILockScreen;
}

export const initialMainState: MainState = {
    activeCVs: [],
    freeMode: false,
    currentFareBusStop: null,
    selectedBusStop: null,
    busStopFareId: '',
    busStopList: [],
    fareBusStopList: [],
    userInfo: {},
    currentDir: {},
    deviation: {
        currentBlock: '--:--',
        isHeadway: true,
        minSec: '--:--',
        bars: 0,
        direction: '',
        color: 'black',
    },
    nextBusInfo: {
        show: false,
        busBehindOccupancy: 0,
        busBehindTime: 0,
    },
    cvIconStatus: [],
    bootUp: {
        softwareVersion: '',
        osVersion: '',
        releaseDate: '',
        serialNumber: '',
        busId: '',
        service: '',
    },
    fareConsole: {
        deckType: {
            id: 0,
            label: '',
        },
        blsStatus: 0,
        time: '',
        date: '',
        busId: '',
        complimentaryDays: 0,
        message: '',
    },
    outOfService: {},
    dagwOperation: {
        title: '',
        message: '',
    },
    tapCardLogin: {},
    manualLogin: {},
    endTripInfo: {
        title: '',
        direction: '',
        service: 0,
        firstBusStop: {},
        lastBusStop: {},
        busStopList: [],
        reasonList: [],
    },
    breakDownInfo: {
        title: '',
        direction: '',
        service: 0,
        firstBusStop: {},
        lastBusStop: {},
        busStopList: [],
        reasonList: [],
    },
    cmBusIdInformation: {
        busId: '',
        operator: {
            id: 0,
            label: '',
            serviceProvider: 0,
        },
    },
    externalDevices: {
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
    },
    language: 'EN',
    startTrip: {},
    lockScreen: {},
};

export const mainReducer = createReducer(
    initialMainState,
    // Action to update the entire bus stop list
    on(updateBusStopList, (state, { busStopList, fareBusStopList }) => {
        return {
            ...state,
            ...(busStopList ? { busStopList: busStopList } : {}),
            ...(fareBusStopList ? { fareBusStopList: fareBusStopList } : {}),
        };
    }),

    on(updateOutOfService, (state, { payload }) => {
        return {
            ...state,
            outOfService: { ...payload },
        };
    }),

    on(updateCvUpgradeStatus, (state, { payload }) => {
        return {
            ...state,
            outOfService: { ...state.outOfService, cvUpgradeStatus: payload },
        };
    }),

    on(updateBootUp, (state, { payload }) => {
        return {
            ...state,
            bootUp: { ...state.bootUp, ...payload },
        };
    }),

    on(updateFareConsole, (state, { payload, msgID }) => {
        return {
            ...state,
            fareConsole: { ...state.fareConsole, ...payload, msgID },
        };
    }),

    on(updateTapCardLogin, (state, { payload, msgID }) => {
        return {
            ...state,
            tapCardLogin: { ...payload, msgID },
        };
    }),

    on(updateManualLogin, (state, { payload, msgID }) => {
        return {
            ...state,
            manualLogin: { ...payload, msgID },
        };
    }),

    on(updateDagwOperation, (state, { payload }) => {
        return {
            ...state,
            dagwOperation: { ...payload },
        };
    }),

    on(updateDeviation, (state, { payload }) => {
        return {
            ...state,
            deviation: payload,
        };
    }),
    on(updateNextBusInfo, (state, { payload }) => {
        return {
            ...state,
            nextBusInfo: payload,
        };
    }),

    // Action to update the uerInfo
    on(updateUserInfo, (state, { userInfo }) => {
        return {
            ...state,
            userInfo: {
                busServiceNum: userInfo?.busServiceNum || state?.userInfo?.busServiceNum,
                plateNum: userInfo?.plateNum || state?.userInfo?.plateNum,
                spid: userInfo?.spid || state?.userInfo?.spid,
                dir: userInfo?.dir || state?.userInfo?.dir,
                km: userInfo?.km || state?.userInfo?.km,
            },
        };
    }),
    on(updateCurrentNowDest, (state, { payload }) => {
        return {
            ...state,
            currentDir: {
                ...state.currentDir,
                ...payload,
            },
        };
    }),

    on(updateCurrentFareBusStop, (state, { payload, manualBls, misMatch }) => {
        const currentFareBusStop = state?.fareBusStopList?.find((item) => item?.Busid === payload) as IFareBusStop;
        const nextFareBusStop = { ...currentFareBusStop };

        if (typeof manualBls !== 'undefined' && currentFareBusStop) {
            nextFareBusStop['manualBls'] = manualBls;
        }
        if (typeof misMatch !== 'undefined' && currentFareBusStop) {
            nextFareBusStop['misMatch'] = misMatch;
        }
        return {
            ...state,
            currentFareBusStop: currentFareBusStop ? nextFareBusStop : null,
        };
    }),

    on(selectBusStop, (state, { payload }) => {
        return {
            ...state,
            selectedBusStop: payload,
        };
    }),

    on(selectBusStopForFare, (state, { payload }) => {
        const idx: number = state.busStopList.findIndex((bs) => bs.Busid === payload);
        return {
            ...state,
            lineActive: idx,
            busStopFareId: payload,
        };
    }),

    on(updateActiveCVs, (state, { payload }) => {
        return {
            ...state,
            activeCVs: payload,
        };
    }),

    on(updateFreeCVs, (state, { payload }) => {
        return {
            ...state,
            freeMode: payload,
        };
    }),

    on(updateEndTripInfo, (state, { payload, msgID }) => {
        const endTripInfo = { ...state.endTripInfo, ...payload, msgID };
        if (!payload.timeout) {
            endTripInfo.timeout = undefined;
        }
        return {
            ...state,
            endTripInfo,
        };
    }),
    on(updateBreakDownInfo, (state, { payload, msgID }) => {
        const breakDownInfo = { ...state.breakDownInfo, ...payload, msgID };

        // if (msgID) {
        //     endTripInfo.msgID = msgID;
        // } else {
        //     endTripInfo.msgID = state.endTripInfo.msgID;
        // }
        return {
            ...state,
            breakDownInfo,
        };
    }),

    on(updateCommissionBusIdInformation, (state, { payload, msgID }) => {
        return {
            ...state,
            cmBusIdInformation: {
                ...state.cmBusIdInformation,
                ...payload,
                msgID,
            },
        };
    }),

    on(updateExternalDevices, (state, { payload, msgID }) => {
        return {
            ...state,
            externalDevices: {
                ...state.externalDevices,
                ...payload,
                msgID,
            },
        };
    }),
    on(updateTestPrinter, (state, { payload }) => {
        return {
            ...state,
            externalDevices: {
                ...state.externalDevices,
                testPrinter: { ...payload },
            },
        };
    }),
    on(updateLanguage, (state, { payload }) => {
        return {
            ...state,
            language: payload.language,
        };
    }),
    on(updateStartTrip, (state, { payload, msgID }) => {
        return {
            ...state,
            startTrip: { ...state.startTrip, ...payload, msgID },
        };
    }),
    on(updateLockScreen, (state, { payload, msgID }) => {
        return {
            ...state,
            lockScreen: { ...state.lockScreen, ...payload, msgID },
        };
    }),
);

export const selectMainState = (state: AppState) => state.main;

export const currentFareBusStop = createSelector(selectMainState, (state) => {
    return state.currentFareBusStop;
});

export const busStopList = createSelector(selectMainState, (state) => {
    return state.busStopList;
});

export const selectedBusStop = createSelector(selectMainState, (state) => {
    return state.selectedBusStop;
});

export const busStopFareId = createSelector(selectMainState, (state) => {
    return state.busStopFareId;
});

export const activeCVs = createSelector(selectMainState, (state) => {
    return state.activeCVs;
});

export const freeMode = createSelector(selectMainState, (state) => {
    return state.freeMode;
});

export const userInfo = createSelector(selectMainState, (state) => {
    return state.userInfo;
});

export const currentDir = createSelector(selectMainState, (state) => {
    return state.currentDir;
});

export const fareBusStopList = createSelector(selectMainState, (state) => {
    return state.fareBusStopList;
});
export const deviation = createSelector(selectMainState, (state) => {
    return state.deviation;
});

export const nextBusInfo = createSelector(selectMainState, (state) => {
    return state.nextBusInfo;
});

export const bootUp = createSelector(selectMainState, (state) => {
    return state.bootUp;
});

export const fareConsole = createSelector(selectMainState, (state) => {
    return state.fareConsole;
});

export const tapCardLogin = createSelector(selectMainState, (state) => {
    return state.tapCardLogin;
});

export const manualLogin = createSelector(selectMainState, (state) => {
    return state.manualLogin;
});

export const outOfService = createSelector(selectMainState, (state) => {
    return state.outOfService;
});

export const dagwOperation = createSelector(selectMainState, (state) => {
    return state.dagwOperation;
});

export const endTripInfo = createSelector(selectMainState, (state) => {
    return state.endTripInfo;
});

export const breakDownInfo = createSelector(selectMainState, (state) => {
    return state.breakDownInfo;
});

export const cmBusIdInformation = createSelector(selectMainState, (state) => {
    return state.cmBusIdInformation;
});

export const externalDevices = createSelector(selectMainState, (state) => {
    return state.externalDevices;
});

export const language = createSelector(selectMainState, (state) => {
    return state.language;
});

export const startTrip = createSelector(selectMainState, (state) => {
    return state.startTrip;
});

export const lockScreen = createSelector(selectMainState, (state) => {
    return state.lockScreen;
});

export {
    updateCurrentFareBusStop,
    selectBusStop,
    selectBusStopForFare,
    updateActiveCVs,
    updateFreeCVs,
    updateBusStopList,
    updateUserInfo,
    updateCurrentNowDest,
    updateDeviation,
    updateNextBusInfo,
    updateBootUp,
    updateFareConsole,
    updateTapCardLogin,
    updateManualLogin,
    updateOutOfService,
    updateCvUpgradeStatus,
    updateDagwOperation,
    updateEndTripInfo,
    updateBreakDownInfo,
    updateCommissionBusIdInformation,
    updateExternalDevices,
    updateTestPrinter,
    updateLanguage,
    updateStartTrip,
    updateLockScreen,
};
