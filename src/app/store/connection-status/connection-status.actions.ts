import { createAction, props } from '@ngrx/store';
import { IConnectionStatus, IConnectionTrigger } from '@models';

export const updateConnectionStatus = createAction(
    '[Update] connection status',
    props<{ payload: IConnectionStatus }>(),
);

export const updateConnectionStatusDisplay = createAction(
    '[Update] connection status display',
    props<{ payload: IConnectionTrigger }>(),
);
