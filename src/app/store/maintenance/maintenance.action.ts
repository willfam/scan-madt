import { createAction, props } from '@ngrx/store';
import { IFareConsole, IBusID, IExternalDevice, IViewParameter, IAppUpgrade, IVersionInfo } from '@models';

export const updateFareConsole = createAction(
    '[Data] Update Fare Console Setting',
    props<{ payload: IFareConsole; msgID?: number }>(),
);

export const updateBusIdInformation = createAction(
    '[Data] Update Bus ID Setting',
    props<{ payload: IBusID; msgID?: number }>(),
);

export const updateExternalDevices = createAction(
    '[Data] Update Bus ID Setting',
    props<{ payload: IExternalDevice; msgID?: number }>(),
);

export const updateTestPrinter = createAction(
    '[Data] Update updateTestPrinter ID Setting',
    props<{ payload: any; msgID?: number }>(),
);

export const updateViewParameter = createAction('[Data] Update ViewParameter', props<{ payload: IViewParameter }>());
export const updateVersionInfo = createAction('[Data] Update Version Info', props<{ payload: IVersionInfo }>());

export const updateAppUpgrade = createAction('[Data] Update Application Upgrade', props<{ payload: IAppUpgrade }>());
