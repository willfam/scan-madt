import { Injectable } from '@angular/core';
import { MqttService } from '@services/mqtt.service'; // Adjust import path as necessary
import MainPageData, {
    headwayTimeTable,
    nextBusInfo,
    cvIconsCount,
    bootUp,
    fareConsole,
    services,
    cvData,
    busStopList,
    currentFmsTrip,
} from './main-page'; // Your dummy bus info data
import {
    AuthStatus,
    MessageId,
    maintenanceDataType,
    MqttTypes,
    MsgID,
    MsgSubID,
    StartTripTypes,
    MessageKeys,
    CommissioningType,
} from '@models';
import { parameters, versionInfoList, blsList, auditRegistrationList, deckTypeList } from './maintenance';

@Injectable({
    providedIn: 'root',
})
export class DummyInitService {
    constructor(private mqttService: MqttService) {}
    // currentStartTrip = StartTripTypes?.FMS_NOT_CONNECTED;
    // Method to initialize dummy data
    initializeDummyData(topics): void {
        console.log('dummy data init');

        // Subscribe to the MQTT topic
        this.mqttService.subscribe({
            topic: topics?.mainPage?.get,
            callback: (message) => {
                const data = JSON.parse(message);
                if (data?.messageType === MqttTypes?.FE_REQUEST && data?.messageId === MessageId?.GET_MAIN_TAB_DATA) {
                    // Publish the dummy data
                    this.mqttService.publishWithFormat(topics?.mainPage?.response, {
                        messaged: MainPageData,
                        messageType: MqttTypes?.BE_RESPONSE,
                        from: 'dummy-init',
                        messageId: MessageId?.GET_MAIN_TAB_DATA,
                    });
                }
            },
        });

        this.mqttService.subscribe({
            topic: topics?.maintenance?.get,
            callback: (message) => {
                const data = JSON.parse(message);
                // Publish the dummy data
                if (data.dataType === maintenanceDataType.VEW_PARAMETER) {
                    this.mqttService.publish(topics?.maintenance?.response, JSON.stringify(parameters));
                } else if (data.dataType === maintenanceDataType.VERSION_INFO) {
                    this.mqttService.publish(topics?.maintenance?.response, JSON.stringify(versionInfoList));
                } else if (data.dataType === maintenanceDataType.BLS_INFORMATION) {
                    this.mqttService.publish(topics?.maintenance?.response, JSON.stringify(blsList));
                } else if (data.dataType === maintenanceDataType.DISPLAY_AUDIT) {
                    this.mqttService.publish(topics?.maintenance?.response, JSON.stringify(auditRegistrationList));
                } else if (data.dataType === maintenanceDataType.FARE_CONSOLE) {
                    this.mqttService.publish(topics?.maintenance?.response, JSON.stringify(fareConsole));
                } else if (data.dataType === maintenanceDataType.DECK_TYPE_LIST) {
                    this.mqttService.publish(topics?.maintenance?.response, JSON.stringify(deckTypeList));
                }
            },
        });

        this.mqttService.subscribe({
            topic: topics?.currentVehicleJourney?.get,
            callback: (message) => {
                const data = JSON.parse(message);
                if (data?.requestType === MqttTypes?.FE_REQUEST) {
                    // Publish the dummy data
                    this.mqttService.publishWithFormat(topics?.currentVehicleJourney?.response, {
                        messaged: headwayTimeTable,
                        requestType: MqttTypes?.BE_RESPONSE,
                        messageId: MessageId?.VEHICLE_JOURNEY,
                        from: 'dummy-init',
                    });
                }
            },
        });

        this.mqttService?.subscribe({
            topic: topics.cvIcon?.get,
            callback: (mes) => {
                const { header, payload } = JSON.parse(mes);
                if (header?.msgID === MsgID.CV_ICONS && header?.msgSubID === MsgSubID.REQUEST) {
                    this.mqttService.publishWithMessageFormat({
                        topic: topics.cvIcon?.response,
                        msgID: MsgID.CV_ICONS,
                        msgSubID: MsgSubID?.RESPONSE,
                        payload: cvData,
                    });
                }
            },
        });

        this.mqttService.subscribe({
            topic: topics?.cvIcon?.get,
            callback: (message) => {
                const data = JSON.parse(message);
                if (data?.requestType === MqttTypes?.FE_REQUEST && data?.messageId === MessageId?.CV_AVAIL_STATUS) {
                    // Publish the dummy data
                    this.mqttService.publish(
                        topics?.cvIcon?.response,
                        JSON.stringify({
                            ...cvIconsCount,
                            requestType: MqttTypes?.BE_RESPONSE,
                            messageId: MessageId?.CV_AVAIL_STATUS,
                            from: 'dummy-init',
                        }),
                    );
                }
            },
        });
        this.mqttService.subscribe({
            topic: topics?.vehicleState?.get,
            callback: (message) => {
                const data = JSON.parse(message);
                if (data?.requestType === MqttTypes?.FE_REQUEST) {
                    // Publish the dummy data
                    this.mqttService.publishWithFormat(topics?.vehicleState?.response, {
                        messaged: nextBusInfo,
                        requestType: MqttTypes?.BE_RESPONSE,
                        messageId: MessageId?.NEXT_BUS_INFO,
                    });
                }
            },
        });

        // this.mqttService.subscribe({
        //     topic: topics?.mainTab?.get,
        //     callback: (message) => {
        //         const data = JSON.parse(message);
        //         const { header, payload } = data;
        //         if (header?.msgID === -2) {
        //             this.currentStartTrip = payload?.type;
        //         }
        //         if (header?.msgID === MsgID?.LOGIN_COMMISSIONING && header?.msgSubID === MsgSubID?.REQUEST) {
        //             const isValid = payload?.value?.length === 3;
        //             this.mqttService?.publishWithMessageFormat({
        //                 topic: topics.mainTab?.response,
        //                 msgID: isValid ? MsgID?.BOOT_UP_COMMISSIONING : MsgID?.LOGIN_COMMISSIONING,
        //                 msgSubID: isValid ? MsgSubID?.NOTIFY : MsgSubID?.RESPONSE,
        //                 payload: {
        //                     ...(isValid
        //                         ? { type: CommissioningType?.CLEARING_ALL_DATA }
        //                         : { messageKey: 'COMMISSIONING_IVALID_NUMERS' }),
        //                 },
        //             });
        //         }
        //         if (header?.msgID === MsgID?.START_TRIP && header?.msgSubID === MsgSubID?.REQUEST) {
        //             this.mqttService?.publishWithMessageFormat({
        //                 topic: topics.mainTab?.response,
        //                 msgID: MsgID?.START_TRIP,
        //                 msgSubID: MsgSubID?.RESPONSE,
        //                 payload: {
        //                     type: this.currentStartTrip,
        //                 },
        //             });
        //         }
        //         if (header?.msgID === MsgID?.START_TRIP_GET_SERVICE_LIST && header?.msgSubID === MsgSubID?.REQUEST) {
        //             this.mqttService?.publishWithMessageFormat({
        //                 topic: topics.mainTab?.response,
        //                 msgID: MsgID?.START_TRIP_GET_SERVICE_LIST,
        //                 msgSubID: MsgSubID?.RESPONSE,
        //                 payload: services,
        //             });
        //         }
        //         if (header?.msgID === MsgID?.BUS_STOP_LIST && header?.msgSubID === MsgSubID?.REQUEST) {
        //             this.mqttService?.publishWithMessageFormat({
        //                 topic: topics.mainTab?.response,
        //                 msgID: MsgID?.BUS_STOP_LIST,
        //                 msgSubID: MsgSubID?.RESPONSE,
        //                 payload: busStopList,
        //             });
        //         }
        //         if (
        //             header?.msgID === MsgID?.START_TRIP_GET_FMS_TRIP_DETAILS &&
        //             header?.msgSubID === MsgSubID?.REQUEST
        //         ) {
        //             this.mqttService?.publishWithMessageFormat({
        //                 topic: topics.mainTab?.response,
        //                 msgID: MsgID?.START_TRIP_GET_FMS_TRIP_DETAILS,
        //                 msgSubID: MsgSubID?.RESPONSE,
        //                 payload: currentFmsTrip,
        //             });
        //         }
        //         if (header?.msgID === MsgID?.START_TRIP_SUBMIT_FARE_TRIP && header?.msgSubID === MsgSubID?.REQUEST) {
        //             this.mqttService?.publishWithMessageFormat({
        //                 topic: topics.mainTab?.response,
        //                 msgID: MsgID?.START_TRIP_SUBMIT_FARE_TRIP,
        //                 msgSubID: MsgSubID?.RESPONSE,
        //                 payload: {
        //                     messageKey: MessageKeys?.FARE_TRIP_DETAILS_SUCCESS,
        //                 },
        //             });
        //         }
        //         if (data?.messageId === MessageId?.AUTH) {
        //             const status = data?.messaged?.status;
        //             switch (status) {
        //                 case AuthStatus.BOOT_UP:
        //                     // Publish the dummy data
        //                     this.mqttService.publishWithFormat(topics?.mainTab?.response, {
        //                         messaged: bootUp,
        //                         messageId: MessageId?.AUTH,
        //                         messageType: MqttTypes?.BE_RESPONSE,
        //                     });
        //                     break;
        //                 case AuthStatus.FARE_CONSOLE_SETTING:
        //                     // Publish the dummy data
        //                     this.mqttService.publishWithFormat(topics?.mainTab?.response, {
        //                         messaged: fareConsole,
        //                         messageId: MessageId?.AUTH,
        //                         messageType: MqttTypes?.BE_RESPONSE,
        //                     });
        //                     break;
        //             }
        //         } else if (header?.msgID || data?.msgID) {
        //             const msgID = data?.header?.msgID || data?.msgID;
        //             switch (msgID) {
        //                 case MsgID.BOOT_UP:
        //                     // Publish the dummy data
        //                     this.mqttService.publishWithMessageFormat({
        //                         topic: topics?.mainTab?.response,
        //                         msgID: MsgID.BOOT_UP,
        //                         msgSubID: MsgSubID.NOTIFY,
        //                         payload: bootUp,
        //                     });
        //                     break;
        //                 // case MsgID.TRIGGER_DAGW_OPERATION:
        //                 //     // Publish the dummy data
        //                 //     this.mqttService.publishWithMessageFormat({
        //                 //         topic: topics?.mainTab?.response,
        //                 //         msgID: MsgID.DAGW_OPERATION,
        //                 //         msgSubID: MsgSubID.NOTIFY,
        //                 //         payload: {
        //                 //             title: dagwOperation.popMsgtitle[0],
        //                 //             message: dagwOperation.popMsgtext[0],
        //                 //         },
        //                 //     });
        //                 //     break;

        //                 // case MsgID.TRIGGER_BOLC_STATUS:
        //                 //     // Publish the dummy data
        //                 //     this.mqttService.publishWithMessageFormat({
        //                 //         topic: topics?.mainTab?.response,
        //                 //         msgID: MsgID.TRIGGER_BOLC_STATUS,
        //                 //         msgSubID: MsgSubID.NOTIFY,
        //                 //         payload: data.payload,
        //                 //     });
        //                 //     break;
        //             }
        //         }
        //     },
        // });
    }
}
