import { createAction, props } from '@ngrx/store';
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

export const updateShowCVStatus = createAction(
    '[Data] Update Fare CV Status Setting',
    props<{ payload: IShowCVStatus; msgID?: number }>(),
);

export const updateCVModeControl = createAction(
    '[Data] Update CV Mode Control Setting',
    props<{ payload: ICVModeControl; msgID?: number }>(),
);

export const updateCVPowerControl = createAction(
    '[Data] Update CV Power Control Setting',
    props<{ payload: ICVPowerControl; msgID?: number }>(),
);

export const updateCVEntryExit = createAction(
    '[Data] Update CV Entry/Exit Control Setting',
    props<{ payload: ICVEntryExitControl; msgID?: number }>(),
);

export const updateRetentionTicket = createAction(
    '[Data] Update Retention ticket ',
    props<{ payload: IRetentionTicket; msgID?: number }>(),
);

export const updatePrintStatus = createAction(
    '[Data] Update print status ticket ',
    props<{ payload: IPrintStatus; msgID?: number }>(),
);

export const updateCancelRideCV1 = createAction(
    '[Data] Update Cancel Ride CV1',
    props<{ payload: ICancelRide; msgID?: number }>(),
);

export const updateCancelRideCV2 = createAction(
    '[Data] Update Cancel Ride CV2',
    props<{ payload: ICancelRide; msgID?: number }>(),
);

export const updateConcessionCV1 = createAction(
    '[Data] Update Concession CV1',
    props<{ payload: IConcession; msgID?: number }>(),
);

export const updateConcessionCV2 = createAction(
    '[Data] Update Concession CV2',
    props<{ payload: IConcession; msgID?: number }>(),
);
