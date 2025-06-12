import { StrNum, ConnectionStatus, ToggleCvStatus } from './types';
import { StartTripTypes } from './constants';

export interface IBusStop {
    Busid: string;
    Name: string;
}
export interface IFmsBusStop {
    Busid: string;
    Name: string;
    km?: number;
    aitp?: boolean;
    flag?: string;
    time?: string;
}

// use this for all bus stop
export interface IFareBusStop {
    Busid: string;
    Name: string;
    km?: string;
    flag?: string;
    misMatch?: boolean;
    manualBls?: boolean;
}

export interface CvIcons {
    id: number;
    activeIcon: string | null;
    timer: ReturnType<typeof setTimeout> | number | null;
    label: string | null;
    error: boolean;
    statuses: number[];
    message?: string;
}

export interface IUserInfoMain {
    busServiceNum?: string;
    plateNum?: string;
    spid?: string;
    dir?: StrNum;
    km?: string;
}

export interface ICurrenNowDest {
    now?: string;
    dest?: string;
}

export interface ICurrentFareBusStop {
    current?: StrNum;
    prev?: StrNum;
    next?: StrNum;
}

export interface IDeviation {
    messageId?: string;
    currentBlock: string;
    isHeadway: boolean;
    minSec: string;
    bars: number;
    direction: string;
    color: string;
}

export interface INextBusInfo {
    show: boolean;
    busBehindOccupancy: number;
    busBehindTime: number;
}

export interface ICvsStatus {
    doorNumber: number;
    status?: ConnectionStatus; // expected value connected | disconneted | no-tapping
    toggleCv?: ToggleCvStatus; // expected value entry | exit | entry-exit
    isFree?: boolean; // expected value true | false
}

export interface IBootUpError {
    criticalError?: string;
    error?: string;
}

// export interface IFareConsole {
//     deckType: string;
//     blsStatus: string;
//     time: string;
//     date: string;
//     busId: string;
//     complimentaryDays: number;
// }

export interface IBootUp {
    error?: IBootUpError;
    softwareVersion?: string;
    osVersion?: string;
    releaseDate?: string;
    serialNumber?: StrNum;
    busId?: string;
    service?: string;
}

export interface IOutOfService {
    title?: string;
    message?: string;
    action?: string;
    reason?: string;
    upgradeStatus?: string;
    cvUpgradeStatus?: number;
}

export interface IDagwOperation {
    title: string;
    message: string;
    fileName?: string;
    percentage?: number | null;
    status?: number;
}

export interface IConnectionStatus {
    statusBTS?: boolean;
    statusBOLC?: boolean;
    statusFARE?: boolean;
    statusFMS?: boolean;
    statusCRP?: boolean;
}

export interface IConnectionTrigger {
    triggerBOLCButton?: boolean;
}

export interface IStatusIndicators {
    label: string;
    connected: boolean | undefined;
    trigger: boolean | undefined;
}

export interface IServiceData {
    serviceNumber?: number;
    dir?: number;
    variantName?: string;
}

export interface ITapCardLogin {
    msgID?: number;
    msgSubID?: number;
    status?: number;
    message?: string;
    pin?: string;
    dutyNumber?: string;
    timeout?: number;
}

export interface IManualLogin extends ITapCardLogin {
    staffId?: string;
    timeout?: number;
}

export interface IEndTrip {
    msgID?: number;
    status?: number;
    title?: string;
    service: number;
    direction: number | string;
    timeout?: number;
    firstBusStop: {
        Busid?: number;
        Name?: string;
    };
    lastBusStop: {
        Busid?: number;
        Name?: string;
    };
    busStopList?: {
        Busid: string;
        Name: string;
    }[];
    reasonList?: IEndTripReason[];
}

export interface IBreakDown {
    msgID?: number;
    status?: number;
    title?: string;
    message?: string;
    service: number;
    direction: number | string;
    firstBusStop: {
        Busid?: string;
        Name?: string;
    };
    lastBusStop: {
        Busid?: string;
        Name?: string;
    };
    busStopList?: {
        Busid: string;
        Name: string;
    }[];
    reasonList?: IEndTripReason[];
}
export interface IEndTripReason {
    id: number;
    label: string;
}

export interface IDeckTypeList {
    id: number;
    label: string;
}

export interface IFareConsole {
    msgID?: number;
    status?: number;
    deckType: {
        id: number;
        label: string;
    };
    blsStatus: number;
    time?: string;
    date?: string;
    busId: string;
    complimentaryDays: number;
    maximumcomplimentaryDays?: number;
    deckTypeList?: IDeckTypeList[];
    percentage?: number;
    message: string;
    isSubmitted?: boolean;
}

export interface IStartTrip {
    msgID?: number;
    status?: number;
    type?: StartTripTypes;
    message?: string;
    dir?: number;
    variantName?: string;
    fms?: {
        serviceNumber?: number;
        dir?: number;
        variantName?: string;
        busStop?: IBusStop;
    };
    fare?: {
        serviceNumber?: number;
        dir?: number;
        variantName?: string;
        busStop?: IBusStop;
    };
    busStopList?: IBusStop[];
    services?: {
        serviceNumber: number;
        dir: number;
        variantName: string;
    }[];
}

export interface ILockScreen {
    msgID?: number;
    status?: number;
    message?: string;
}

export interface IPopUpControl {
    show: boolean;
    message?: string;
    disabled?: boolean;
}
