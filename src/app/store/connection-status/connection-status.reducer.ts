import { createReducer, on, createSelector } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { IConnectionStatus, IConnectionTrigger } from '@models';
import { updateConnectionStatus, updateConnectionStatusDisplay } from './connection-status.actions';

export interface ConnectionStatusState {
    connection: IConnectionStatus;
    trigger: IConnectionTrigger;
}

export const initConnectionStatus: ConnectionStatusState = {
    connection: {
        statusBTS: false,
        statusBOLC: false,
        statusFARE: true,
        statusFMS: false,
        statusCRP: false,
    },
    trigger: {
        triggerBOLCButton: false,
    },
};

export const connectionStatusReducer = createReducer(
    initConnectionStatus,
    on(updateConnectionStatus, (state, { payload }) => {
        return {
            ...state,
            connection: { ...state.connection, ...payload },
        };
    }),
    on(updateConnectionStatusDisplay, (state, { payload }) => {
        return {
            ...state,
            trigger: { ...state.trigger, ...payload },
        };
    }),
);

export const selectConnectionStatusState = (state: AppState) => state?.connectionStatus;

export const allConnectionStatus = createSelector(selectConnectionStatusState, (state) => {
    return state.connection;
});

export const allConnectionDisplay = createSelector(selectConnectionStatusState, (state) => {
    return state.trigger;
});

export { updateConnectionStatus, updateConnectionStatusDisplay };
