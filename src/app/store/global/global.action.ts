import { createAction, props } from '@ngrx/store';
import { IAuth } from '@models';

export const updateLoading = createAction('[Data] Update Loading', props<{ payload: boolean }>());
export const updateAuth = createAction('[Data] Update auth', props<{ payload: IAuth; msgID?: number }>());
export const updateIsOnTrip = createAction('[Data] Update On Trip status', props<{ payload: boolean }>());
