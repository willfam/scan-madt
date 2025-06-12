import { Action, ActionReducer } from '@ngrx/store';
import { MainState, mainReducer } from './main/main.reducer';
import { ConnectionStatusState, connectionStatusReducer } from './connection-status/connection-status.reducer';
import { MaintenanceState, maintenanceReducer } from './maintenance/maintenance.reducer';
import { FareState, fareReducer } from './fare/fare.reducer';
import { GlobalState, globalReducer } from './global/global.reducer';

export interface AppState {
    main: MainState;
    maintenance: MaintenanceState;
    fare: FareState;
    connectionStatus: ConnectionStatusState;
    global: GlobalState;
}

export interface AppStore {
    main: ActionReducer<MainState, Action>;
    maintenance: ActionReducer<MaintenanceState, Action>;
    fare: ActionReducer<FareState, Action>;
    connectionStatus: ActionReducer<ConnectionStatusState, Action>;
    global: ActionReducer<GlobalState, Action>;
}

export const appStore: AppStore = {
    main: mainReducer,
    maintenance: maintenanceReducer,
    fare: fareReducer,
    connectionStatus: connectionStatusReducer,
    global: globalReducer,
};
