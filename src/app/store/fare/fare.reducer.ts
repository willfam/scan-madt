import { createReducer, on, createSelector } from '@ngrx/store';
import { AppState } from '@store/app.state';
import {
    IShowCVStatus,
    ICVModeControl,
    ICVPowerControl,
    ICVEntryExitControl,
    IRetentionTicket,
    IPrintStatus,
    ICancelRide,
    IConcession,
} from '@models';
import {
    updateShowCVStatus,
    updateCVModeControl,
    updateCVPowerControl,
    updateCVEntryExit,
    updateRetentionTicket,
    updatePrintStatus,
    updateCancelRideCV1,
    updateCancelRideCV2,
    updateConcessionCV1,
    updateConcessionCV2,
} from './fare.action';

export interface FareState {
    showCVStatus: IShowCVStatus;
    cvModeControl: ICVModeControl;
    cvPowerControl: ICVPowerControl;
    cvEntryExitControl: ICVEntryExitControl;
    retentionTicket: IRetentionTicket;
    printStatus: IPrintStatus;
    cancelRideCV1: ICancelRide;
    cancelRideCV2: ICancelRide;
    concessionCV1: IConcession;
    concessionCV2: IConcession;
}

export const initialFareState: FareState = {
    showCVStatus: {
        cvStatus: [],
    },
    cvModeControl: {
        always: false,
        normal: false,
    },
    cvPowerControl: {
        group: [],
    },
    cvEntryExitControl: {
        cvType: 0,
    },
    retentionTicket: {},
    printStatus: {
        status: false,
    },
    cancelRideCV1: {},
    cancelRideCV2: {},
    concessionCV1: {},
    concessionCV2: {},
};

export const fareReducer = createReducer(
    initialFareState,
    on(updateShowCVStatus, (state, { payload, msgID }) => {
        return {
            ...state,
            showCVStatus: {
                ...payload,
                msgID,
            },
        };
    }),
    on(updateCVModeControl, (state, { payload, msgID }) => {
        return {
            ...state,
            cvModeControl: {
                ...state.cvModeControl,
                ...payload,
                msgID,
            },
        };
    }),
    on(updateCVPowerControl, (state, { payload, msgID }) => {
        return {
            ...state,
            cvPowerControl: {
                ...payload,
                msgID,
            },
        };
    }),
    on(updateCVEntryExit, (state, { payload, msgID }) => {
        return {
            ...state,
            cvEntryExitControl: {
                ...payload,
                msgID,
            },
        };
    }),
    on(updateRetentionTicket, (state, { payload, msgID }) => {
        return {
            ...state,
            retentionTicket: {
                ...state.retentionTicket,
                ...payload,
                msgID,
            },
        };
    }),
    on(updatePrintStatus, (state, { payload, msgID }) => {
        return {
            ...state,
            printStatus: {
                ...payload,
                msgID,
            },
        };
    }),
    on(updateCancelRideCV1, (state, { payload, msgID }) => {
        return {
            ...state,
            cancelRideCV1: {
                ...payload,
                msgID,
            },
        };
    }),
    on(updateCancelRideCV2, (state, { payload, msgID }) => {
        return {
            ...state,
            cancelRideCV2: {
                ...payload,
                msgID,
            },
        };
    }),
    on(updateConcessionCV1, (state, { payload, msgID }) => {
        return {
            ...state,
            concessionCV1: {
                ...payload,
                msgID,
            },
        };
    }),
    on(updateConcessionCV2, (state, { payload, msgID }) => {
        return {
            ...state,
            concessionCV2: {
                ...payload,
                msgID,
            },
        };
    }),
);

export const selectMaintenanceState = (state: AppState) => state.fare;

export const showCVStatus = createSelector(selectMaintenanceState, (state) => {
    return state.showCVStatus;
});

export const cvModeControl = createSelector(selectMaintenanceState, (state) => {
    return state.cvModeControl;
});

export const cvPowerControl = createSelector(selectMaintenanceState, (state) => {
    return state.cvPowerControl;
});

export const cvEntryExitControl = createSelector(selectMaintenanceState, (state) => {
    return state.cvEntryExitControl;
});

export const retentionTicket = createSelector(selectMaintenanceState, (state) => {
    return state.retentionTicket;
});

export const printStatus = createSelector(selectMaintenanceState, (state) => {
    return state.printStatus;
});

export const cancelRideCV1 = createSelector(selectMaintenanceState, (state) => {
    return state.cancelRideCV1;
});

export const cancelRideCV2 = createSelector(selectMaintenanceState, (state) => {
    return state.cancelRideCV2;
});

export const concessionCV1 = createSelector(selectMaintenanceState, (state) => {
    return state.concessionCV1;
});

export const concessionCV2 = createSelector(selectMaintenanceState, (state) => {
    return state.concessionCV2;
});

export {
    updateShowCVStatus,
    updateCVModeControl,
    updateCVPowerControl,
    updateCVEntryExit,
    updateRetentionTicket,
    updatePrintStatus,
    updateCancelRideCV1,
    updateCancelRideCV2,
    updateConcessionCV1,
    updateConcessionCV2,
};
