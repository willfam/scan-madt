export interface IFareCVStatus {
    cvNum: number;
    status: number;
    subStatus?: number;
}

export interface IShowCVStatus {
    status?: number;
    message?: string;
    cvStatus: IFareCVStatus[];
}

export interface ICVModeControl {
    status?: number;
    message?: string;
    always: boolean;
    normal: boolean;
}

export interface ICVPowerControl {
    status?: number;
    message?: string;
    group: {
        id: number;
        cvs: string[];
        status: boolean;
    }[];
}

export interface ICVEntryExitControl {
    status?: number;
    message?: string;
    cvType: number;
}

export interface IRetentionTicket {
    msgID?: number;
    status?: number;
    message?: string;
    cartAt?: string;
    cardDetail?: {
        id: string;
        value: number;
    };
}

export interface IPrintStatus {
    msgID?: number;
    message?: string;
    status: boolean;
}

export interface ICancelRide {
    msgID?: number;
    message?: string;
    status?: number;
}

export interface IConcession {
    msgID?: number;
    message?: string;
    status?: number;
}
