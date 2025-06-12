import { createReducer, on, createSelector } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { IFareConsole, IBusID, IExternalDevice, IViewParameter, IVersionInfo, IAppUpgrade } from '@models';
import {
    updateFareConsole,
    updateBusIdInformation,
    updateExternalDevices,
    updateTestPrinter,
    updateViewParameter,
    updateAppUpgrade,
    updateVersionInfo,
} from './maintenance.action';

export interface MaintenanceState {
    fareConsole: IFareConsole;
    busIdInformation: IBusID;
    externalDevices: IExternalDevice;
    viewParameter: IViewParameter;
    appUpgrade: IAppUpgrade;
    versionInfo: IVersionInfo;
}

export const initialMaintenanceState: MaintenanceState = {
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
    busIdInformation: {
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
    viewParameter: {
        parameters: [],
    },
    appUpgrade: {},
    versionInfo: {
        versionInfoList: [],
    },
};

export const maintenanceReducer = createReducer(
    initialMaintenanceState,
    on(updateFareConsole, (state, { payload, msgID }) => {
        return {
            ...state,
            fareConsole: {
                ...state.fareConsole,
                ...payload,
                msgID,
            },
        };
    }),
    on(updateBusIdInformation, (state, { payload, msgID }) => {
        return {
            ...state,
            busIdInformation: {
                ...state.busIdInformation,
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
    on(updateViewParameter, (state, { payload }) => {
        // console.log('updateViewParameter', payload);
        return {
            ...state,
            viewParameter: { ...payload },
        };
    }),
    on(updateAppUpgrade, (state, { payload }) => {
        return {
            ...state,
            appUpgrade: { ...payload },
        };
    }),
    on(updateVersionInfo, (state, { payload }) => {
        // console.log('updateViewParameter', payload);
        return {
            ...state,
            versionInfo: { ...payload },
        };
    }),
);

export const selectMaintenanceState = (state: AppState) => state.maintenance;

export const fareConsole = createSelector(selectMaintenanceState, (state) => {
    return state.fareConsole;
});

export const busIdInformation = createSelector(selectMaintenanceState, (state) => {
    return state.busIdInformation;
});

export const externalDevices = createSelector(selectMaintenanceState, (state) => {
    return state.externalDevices;
});

export const viewParameter = createSelector(selectMaintenanceState, (state) => {
    return state.viewParameter;
});

export const appUpgrade = createSelector(selectMaintenanceState, (state) => {
    return state.appUpgrade;
});

export const versionInfo = createSelector(selectMaintenanceState, (state) => {
    return state.versionInfo;
});

export {
    updateFareConsole,
    updateBusIdInformation,
    updateExternalDevices,
    updateTestPrinter,
    updateViewParameter,
    updateAppUpgrade,
    updateVersionInfo,
};
