import { IClientPublishOptions } from 'mqtt';

export interface ISubscribeMQTT {
    topic: string;
    callback: (message: string, topic?: string) => void;
    topicKey?: string;
}

export const MqttTypes = {
    BE_RESPONSE: 'BE_RESPONSE',
    FE_REQUEST: 'FE_REQUEST',
} as const;

export interface IMessageFormat {
    header: {
        dateTime: string;
        formatVersion: string;
        msgID: number;
        msgSubID?: number;
    };
    payload: any;
}

export interface IPublishParameter {
    topic: string;
    msgID: number;
    payload?: any;
    msgSubID?: number;
    opts?: IClientPublishOptions;
}
