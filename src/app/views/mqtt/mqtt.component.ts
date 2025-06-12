import { Component, OnInit } from '@angular/core';
import { MqttService } from '@services/mqtt.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms'; // Import FormsModule to use ngModel
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import MainPageDummy, { dagwOperation, services } from '@dummyData/main-page';
import { parameters, versionInfoList } from '@dummyData/maintenance';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
    AuthStatus,
    MessageId,
    MqttTypes,
    HTTimeColor,
    MsgID,
    MsgSubID,
    DagwOperationStatus,
    CvDirTypeArray,
    ResponseStatus,
    CommissioningType,
    MainPagePopUp,
    StartTripTypes,
} from '@models';

@Component({
    selector: 'app-mqtt',
    standalone: true,
    imports: [
        MatButtonModule,
        FormsModule,
        CommonModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatInputModule,
        MatCheckboxModule,
    ],
    templateUrl: './mqtt.component.html',
    styleUrls: ['./mqtt.component.scss'],
})
export class MqttComponent implements OnInit {
    MsgID = MsgID;
    [x: string]: any;
    brokerUrl: any = {
        host: 'broker.hivemq.com',
        protocol: 'ws',
        port: '8000',
        path: '/mqtt',
    }; // 'ws://broker.hivemq.com:8000/mqtt'; // Property to bind the input field
    timeHeadColor = HTTimeColor;
    isConnected: boolean | null = null;
    isLoading: boolean | null = true;
    topics: any; // Define topics variable
    cvUrl: any;
    cvErrorMsg: string = '';
    isError: boolean = false;
    activeIcon: any;

    cvDirOptions = CvDirTypeArray;
    routeInit = {
        now: null,
        dest: null,
        fareBusStop: null,
    };
    currentMainPagePop: string = MainPagePopUp?.BUS_STOP_MISMATCH;
    currentRoute = this.routeInit;
    busRouteList = MainPageDummy?.fareBusStopList;
    headTimeTTable = {
        currentBlock: 'RWS8-09',
        isHeadway: true,
        minSec: '0:40',
        bars: 1,
        direction: 'left',
        color: 'blue',
    };
    dirTypes = [
        {
            label: 'Now',
            val: 'now',
        },
        {
            label: 'Destination',
            val: 'dest',
        },
        {
            label: 'Next',
            val: 'next',
        },
        {
            label: 'Current Bus Stop',
            val: 'CURRENT_BUS_STOP',
        },
    ];
    nextBusInfo = {
        show: false,
        busBehindOccupancy: 0,
        busBehindTime: 0,
    };
    iconNames: any = [
        {
            value: 1,
            url: '/assets/images/icons/main/workfare-icon.svg',
        },
        {
            value: 2,
            url: '/assets/images/icons/main/pwd.svg',
        },
        {
            value: 3,
            url: '/assets/images/icons/main/soldier-icon.svg',
        },
        {
            value: 4,
            url: '/assets/images/icons/main/student-icon.svg',
        },
        {
            value: 5,
            url: '/assets/images/icons/main/senior-icon.svg',
        },
        {
            value: 6,
            url: '/assets/images/icons/main/children-icon.svg',
        },
        {
            value: 7,
            url: '/assets/images/icons/main/staff-icon.svg',
        },
        {
            value: 8,
            url: '/assets/images/icons/main/workfare-icon.svg',
        },
        {
            value: 9,
            url: '',
        },
    ];
    manualBls = false;
    misMatch = false;
    fareBusStopIndex = -1;
    fmsBusStop: any = {
        busServiceNum: '105m',
        plateNum: 'SBS34567',
        spid: 'AAA(27)',
        dir: 8,
        km: '50.5',
    };

    authList = [
        {
            id: 17,
            label: 'Main Page Data',
            isLatest: true,
            data: {
                msgID: MsgID?.MAIN_PAGE_DATA,
                msgSubID: MsgSubID?.NOTIFY,
                ...MainPageDummy,
            },
        },
        {
            id: 7,
            label: 'Out of service: w/info (Upgrade CV)',
            isLatest: true,
            data: {
                msgID: MsgID?.OUT_OF_SERVICE_INFO,
                // errorKey: OutOfServiceType?.PENDING_UPGRADE_CV,
                title: 'Out of Service',
                action: 'Proceed for BEV for Login',
                message: 'TRANSFER REQUIRED',
                reason: '[KEY EXPIRED]',
                upgradeStatus: 'Pending upgrade on CV',
            },
        },
        {
            id: 4,
            label: 'Tap Card Duty Number Success',
            isLatest: true,
            data: {
                msgID: MsgID?.BC_TAP_CARD_DUTY,
                msgSubID: MsgSubID?.NOTIFY,
            },
        },
        {
            id: 5,
            label: 'Bus Operation menu (Start trip | End shift)',
            isLatest: true,
            data: {
                msgID: MsgID?.BUS_OPERATION_MENU,
            },
        },
        {
            id: 20,
            label: 'Start trip - Done',
            isLatest: true,
            data: {
                msgID: MsgID?.START_TRIP_SUBMIT_FARE_TRIP,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 21,
            label: 'Free - Accept Request',
            isLatest: true,
            data: {
                msgID: MsgID?.MAIN_FREE,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 21,
            label: 'Free - Success',
            isLatest: true,
            data: {
                msgID: MsgID?.MAIN_FREE_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },

        {
            id: 24,
            label: 'Breakdown - Request Break Down Successful',
            isLatest: true,
            data: {
                msgID: MsgID?.BREAKDOWN,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 24,
            label: 'Breakdown - Information',
            isLatest: true,
            data: {
                msgID: MsgID?.BREAKDOWN_TYPE,
                msgSubID: MsgSubID?.RESPONSE,
                title: 'END_TRIP_BREAKDOWN_DETAIL',
                service: 58,
                direction: 1,
                firstBusStop: {
                    Busid: '2',
                    Name: 'Buskpark',
                },
                lastBusStop: {
                    Busid: '4',
                    Name: 'Bendock interchange',
                },
            },
        },
        {
            id: 24,
            label: 'Breakdown - Bus Stop List',
            isLatest: true,
            data: {
                msgID: MsgID?.BREAKDOWN_BUS_STOP_LIST,
                msgSubID: MsgSubID?.RESPONSE,
                busStopList: [
                    {
                        Busid: '1',
                        Name: 'Bishan Pk',
                    },
                    {
                        Busid: '2',
                        Name: 'Buspark',
                    },
                    {
                        Busid: '3',
                        Name: 'Bedok Interchange Boarding Berth 3 to 10 PK',
                    },
                    { Busid: '4', Name: 'Bendock interchange' },
                    {
                        Busid: '5',
                        Name: 'Bishan Pk 2',
                    },
                    {
                        Busid: '6',
                        Name: 'Buspark 2',
                    },
                    {
                        Busid: '7',
                        Name: 'Bedok Interchange Boarding Berth 3 to 10 PK 2',
                    },
                    { Busid: '8', Name: 'Bendock interchange 2' },
                    {
                        Busid: '9',
                        Name: 'Bishan Pk 3',
                    },
                    {
                        Busid: '10',
                        Name: 'Buspark 3',
                    },
                    {
                        Busid: '11',
                        Name: 'Bedok Interchange Boarding Berth 3 to 10 PK 3',
                    },
                    { Busid: '12', Name: 'Bendock interchange 3' },
                ],
            },
        },
        {
            id: 24,
            label: 'Breakdown - Success',
            isLatest: true,
            data: {
                msgID: MsgID?.BREAKDOWN_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
                reasonList: [
                    {
                        id: 1,
                        label: 'Engine Failure',
                    },
                    {
                        id: 2,
                        label: 'Flat Tyre',
                    },
                    {
                        id: 3,
                        label: 'Transmission Failure',
                    },
                    {
                        id: 4,
                        label: 'Flat Battery',
                    },
                    {
                        id: 5,
                        label: 'Electrical Fault',
                    },
                    {
                        id: 6,
                        label: 'Broken Widescreen',
                    },
                ],
            },
        },
        // {
        //     id: 14,
        //     label: 'Breakdown - Reasons',
        //     isLatest: true,
        //     data: {
        //         msgID: MsgID?.BREAKDOWN_REASON,
        //         msgSubID: MsgSubID?.RESPONSE,
        //         reasonList: [
        //             {
        //                 id: 1,
        //                 label: 'Engine Failure',
        //             },
        //             {
        //                 id: 2,
        //                 label: 'Flat Tyre',
        //             },
        //             {
        //                 id: 3,
        //                 label: 'Transmission Failure',
        //             },
        //             {
        //                 id: 4,
        //                 label: 'Flat Battery',
        //             },
        //             {
        //                 id: 5,
        //                 label: 'Electrical Fault',
        //             },
        //             {
        //                 id: 6,
        //                 label: 'Broken Widescreen',
        //             },
        //         ],
        //     },
        // },
        {
            id: 24,
            label: 'Breakdown - Submit Reason',
            isLatest: true,
            data: {
                msgID: MsgID?.BREAKDOWN_SUBMIT_REASON,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 24,
            label: 'Breakdown - Submit Comp Tickets',
            isLatest: true,
            data: {
                msgID: MsgID?.BREAKDOWN_SUBMIT_COMP_TICKET,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 24,
            label: 'Breakdown - Submit Comp Tickets Error',
            isLatest: true,
            data: {
                msgID: MsgID?.BREAKDOWN_SUBMIT_COMP_TICKET,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.ERROR,
                message: 'PRINTER_PAPER_LOW',
            },
        },
        {
            id: 24,
            label: 'Breakdown - Process Comp Tickets',
            isLatest: true,
            data: {
                msgID: MsgID?.BREAKDOWN_PROCESS_COMP_TICKET,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 24,
            label: 'Breakdown - Submit Breakdown Tickets',
            isLatest: true,
            data: {
                msgID: MsgID?.BREAKDOWN_SUBMIT_BREAKDOWN_TICKET,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 24,
            label: 'Breakdown - Submit Breakdown Tickets Error',
            isLatest: true,
            data: {
                msgID: MsgID?.BREAKDOWN_SUBMIT_BREAKDOWN_TICKET,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.ERROR,
                message: 'PRINTER_PAPER_JAM',
            },
        },
        {
            id: 24,
            label: 'Breakdown - Process Breakdown Tickets',
            isLatest: true,
            data: {
                msgID: MsgID?.BREAKDOWN_PROCESS_BREAKDOWN_TICKET,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 24,
            label: 'Breakdown - Submit Breakdown Without Print',
            isLatest: true,
            data: {
                msgID: MsgID?.BREAKDOWN_SUBMIT_WO_PRINT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },

        {
            id: 21,
            label: 'Rear Doors - Accept Request',
            isLatest: true,
            data: {
                msgID: MsgID?.MAIN_REAR_DOORS,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 21,
            label: 'Rear Doors - Success',
            isLatest: true,
            data: {
                msgID: MsgID?.MAIN_REAR_DOORS_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
                cvList: [
                    { cvNumber: 3, statuses: [4] },
                    { cvNumber: 4, statuses: [4] },
                    { cvNumber: 5, statuses: [4] },
                    { cvNumber: 6, statuses: [4] },
                ],
            },
        },

        {
            id: 21,
            label: 'Front Doors - Accept Request',
            isLatest: true,
            data: {
                msgID: MsgID?.MAIN_FRONT_DOOR,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
                timeout: 10000,
            },
        },
        {
            id: 21,
            label: 'Front Doors - CV1 Success',
            isLatest: true,
            data: {
                msgID: MsgID?.MAIN_FRONT_DOOR_CV1,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
                statuses: [4],
            },
        },
        {
            id: 21,
            label: 'Front Doors - CV2 Success',
            isLatest: true,
            data: {
                msgID: MsgID?.MAIN_FRONT_DOOR_CV2,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
                statuses: [4],
            },
        },

        {
            id: 21,
            label: 'Redeem - Accept Request',
            isLatest: true,
            data: {
                msgID: MsgID?.MAIN_REDEEM,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },

        {
            id: 22,
            label: 'Lock - Response',
            isLatest: true,
            data: {
                msgID: MsgID?.LOCK,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 22,
            label: 'Lock - Success',
            isLatest: true,
            data: {
                msgID: MsgID?.LOCK_CONFIRM,
                msgSubID: MsgSubID?.NOTIFY,
            },
        },
        {
            id: 22,
            label: 'Unlock - Success',
            isLatest: true,
            data: {
                msgID: MsgID?.UNLOCK_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 22,
            label: 'Unlock - Failure',
            isLatest: true,
            data: {
                msgID: MsgID?.UNLOCK_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.ERROR,
                message: 'INVALID_CODE',
            },
        },

        {
            id: 14,
            label: 'Request End Trip Successful',
            isLatest: true,
            data: {
                msgID: MsgID?.END_TRIP,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
                timeout: 5000,
            },
        },
        {
            id: 14,
            label: 'Notify End Trip ',
            isLatest: true,
            data: {
                msgID: MsgID?.END_TRIP,
                timeout: 5000,
            },
        },
        {
            id: 14,
            label: 'End Trip Information',
            isLatest: true,
            data: {
                msgID: MsgID?.END_TRIP_TYPE,
                msgSubID: MsgSubID?.RESPONSE,
                title: 'END_TRIP_DETAILS',
                service: 58,
                direction: 1,
                firstBusStop: {
                    Busid: '2',
                    Name: 'Buskpark',
                },
                lastBusStop: {
                    Busid: '4',
                    Name: 'Bendock interchange',
                },
            },
        },
        // {
        //     id: 14,
        //     label: 'End Trip Bus Stop List',
        //     isLatest: true,
        //     data: {
        //         msgID: MsgID?.END_TRIP_BUS_STOP_LIST,
        //         msgSubID: MsgSubID?.RESPONSE,
        //         busStopList: [
        //             {
        //                 Busid: 1,
        //                 Name: 'Bishan Pk',
        //             },
        //             {
        //                 Busid: 2,
        //                 Name: 'Buspark',
        //             },
        //             {
        //                 Busid: 3,
        //                 Name: 'Bedok Interchange Boarding Berth 3 to 10 PK',
        //             },
        //             { Busid: 4, Name: 'Bendock interchange' },
        //             {
        //                 Busid: 5,
        //                 Name: 'Bishan Pk 2',
        //             },
        //             {
        //                 Busid: 6,
        //                 Name: 'Buspark 2',
        //             },
        //             {
        //                 Busid: 7,
        //                 Name: 'Bedok Interchange Boarding Berth 3 to 10 PK 2',
        //             },
        //             { Busid: 8, Name: 'Bendock interchange 2' },
        //             {
        //                 Busid: 9,
        //                 Name: 'Bishan Pk 3',
        //             },
        //             {
        //                 Busid: 10,
        //                 Name: 'Buspark 3',
        //             },
        //             {
        //                 Busid: 11,
        //                 Name: 'Bedok Interchange Boarding Berth 3 to 10 PK 3',
        //             },
        //             { Busid: 12, Name: 'Bendock interchange 3' },
        //         ],
        //     },
        // },
        {
            id: 14,
            label: 'End Trip Success',
            isLatest: true,
            data: {
                msgID: MsgID?.END_TRIP_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        // {
        //     id: 14,
        //     label: 'End Trip Reasons',
        //     isLatest: true,
        //     data: {
        //         msgID: MsgID?.END_TRIP_REASON,
        //         msgSubID: MsgSubID?.RESPONSE,
        //         reasonList: [
        //             {
        //                 id: 1,
        //                 label: 'Engine Failure',
        //             },
        //             {
        //                 id: 2,
        //                 label: 'Flat Tyre',
        //             },
        //             {
        //                 id: 3,
        //                 label: 'Transmission Failure',
        //             },
        //             {
        //                 id: 4,
        //                 label: 'Flat Battery',
        //             },
        //             {
        //                 id: 5,
        //                 label: 'Electrical Fault',
        //             },
        //             {
        //                 id: 6,
        //                 label: 'Broken Widescreen',
        //             },
        //         ],
        //     },
        // },
        // {
        //     id: 14,
        //     label: 'End Trip Submit Reason',
        //     isLatest: true,
        //     data: {
        //         msgID: MsgID?.END_TRIP_SUBMIT_REASON,
        //         msgSubID: MsgSubID?.RESPONSE,
        //         status: ResponseStatus.SUCCESS,
        //     },
        // },
        // {
        //     id: 14,
        //     label: 'End Trip Submit Comp Tickets',
        //     isLatest: true,
        //     data: {
        //         msgID: MsgID?.END_TRIP_SUBMIT_COMP_TICKET,
        //         msgSubID: MsgSubID?.RESPONSE,
        //         status: ResponseStatus.SUCCESS,
        //     },
        // },
        // {
        //     id: 14,
        //     label: 'End Trip Submit Breakdown Tickets',
        //     isLatest: true,
        //     data: {
        //         msgID: MsgID?.END_TRIP_SUBMIT_BREAKDOWN_TICKET,
        //         msgSubID: MsgSubID?.RESPONSE,
        //         status: ResponseStatus.SUCCESS,
        //     },
        // },

        {
            id: 17,
            label: 'Update FMS Bus stop',
            isLatest: true,
            data: {
                msgID: MsgID?.UPDATE_FMS_BUS_STOP,
                msgSubID: MsgSubID?.NOTIFY,
                fmsBusStopList: [
                    {
                        Busid: '57021',
                        Name: 'Sembawang Road Blk 241',
                        time: '09:48',
                    },
                    {
                        Busid: '57011',
                        Name: 'Opp Sembawang Park',
                        time: '09:50',
                    },
                    {
                        Busid: '57001',
                        Name: 'Sembawang Park',
                        time: '09:53',
                    },
                ],
            },
        },
        {
            id: 17,
            label: 'Update Fare Bus stop',
            isLatest: true,
            data: {
                msgID: MsgID?.UPDATE_FARE_BUS_STOP_LIST,
                msgSubID: MsgSubID?.NOTIFY,
                fareBusStopList: [
                    {
                        Busid: '57021',
                        Name: 'Sembawang Road Blk 241',
                        km: '21.2',
                        flag: 'disabled',
                    },
                    {
                        Busid: '57011',
                        Name: 'Opp Sembawang Park',
                        km: '4',
                        flag: 'active',
                        misMatch: true,
                        manualBls: true,
                    },
                    {
                        Busid: '57001',
                        Name: 'Sembawang Park',
                        km: '1',
                        flag: 'disabled',
                    },
                    {
                        Busid: '56991',
                        Name: 'Sembawang Drive Blk 441',
                        km: '13.2',
                        flag: 'disabled',
                    },
                    {
                        Busid: '56981',
                        Name: 'Sembawang Road Blk 435',
                        km: '15.2',
                        flag: 'disabled',
                    },
                    {
                        Busid: '56971',
                        Name: 'Opp Sembawang Hill Park',
                        km: '13.2',
                        flag: 'disabled',
                    },
                    {
                        Busid: '56961',
                        Name: 'Sembawang Hill Park',
                        km: '1.2',
                        flag: 'disabled',
                    },
                ],
            },
        },
        {
            id: 1,
            label: 'Boot up',
            isLatest: true,
            data: {
                msgID: MsgID?.BOOT_UP,
                softwareVersion: 'BFC.A.05.22.00',
                osVersion: '02.02.23',
                releaseDate: '10/11/2024',
                serialNumber: '3252234785',
                service: 'SMRT',
                busId: 'SG5451',
            },
        },
        {
            id: 2,
            label: 'Boot up error',
            isLatest: true,
            data: {
                msgID: MsgID?.BOOT_UP,
                error: {
                    criticalError: 'ESM: 26600004',
                    error: '140a',
                },
            },
        },
        {
            id: 3,
            label: 'Boot up remove error',
            isLatest: true,
            data: {
                msgID: MsgID?.BOOT_UP,
                error: {},
            },
        },
        {
            id: 3,
            label: 'Shutting Down',
            isLatest: true,
            data: {
                msgID: MsgID?.SHUTTING_DOWN,
                message: 'Shutting Down...',
            },
        },
        {
            id: 3,
            label: 'Shutting Down For Upgrading',
            isLatest: true,
            data: {
                msgID: MsgID?.SHUTTING_DOWN,
                message: 'Shutting Down for Application Upgrade',
            },
        },
        {
            id: 3,
            label: 'Shutting Down For Upgrading From To',
            isLatest: true,
            data: {
                msgID: MsgID?.SD_FOR_UPGRADING_FROM_TO,
                message: 'Application upgraded \nfrom version XXX to version YYY',
            },
        },
        // {
        //     id: 3,
        //     label: 'Shutting Down (Upgrading)',
        //     isLatest: true,
        //     data: {
        //         msgID: MsgID?.SHUTTING_DOWN,
        //         isUpgrading: true,
        //         message: 'Shutting Down...',
        //     },
        // },
        {
            id: 4,
            label: 'BC Tap Card with error',
            isLatest: true,
            data: {
                msgID: MsgID?.BC_TAP_CARD_LOGIN,
                status: 3,
                message: 'CARD_LOGIN_FAILED',
            },
        },
        {
            id: 4,
            label: 'BC Tap Card in Progress',
            isLatest: true,
            data: {
                msgID: MsgID?.BC_TAP_CARD_LOGIN,
                status: 2,
            },
        },
        {
            id: 4,
            label: 'BC Tap Card NA',
            isLatest: true,
            data: {
                msgID: MsgID?.BC_TAP_CARD_LOGIN,
                status: ResponseStatus.NA,
            },
        },
        {
            id: 4,
            label: 'BC Tap Card need PIN',
            isLatest: true,
            data: {
                msgID: MsgID?.BC_TAP_CARD_LOGIN,
                message: 'LOGIN_SUCCESS_NEED_PIN',
                timeout: 5000,
            },
        },
        {
            id: 4,
            label: 'BC Enter PIN in Progress',
            isLatest: true,
            data: {
                msgID: MsgID?.BC_TAP_CARD_PIN,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 4,
            label: 'BC Tap Card Incorrect PIN',
            isLatest: true,
            data: {
                msgID: MsgID?.BC_TAP_CARD_PIN,
                msgSubID: MsgSubID?.RESPONSE,
                message: 'PIN_ERROR_INVALID',
                status: 3,
            },
        },
        {
            id: 4,
            label: 'Tap Card Logon Terminate',
            isLatest: true,
            data: {
                msgID: MsgID?.BC_TAP_CARD_PIN,
                msgSubID: MsgSubID?.RESPONSE,
                message: 'PIN_ERROR_LOGIN_TERMINATE',
                status: 3,
            },
        },
        {
            id: 4,
            label: 'Tap Card Display Duty Number Input',
            isLatest: true,
            data: {
                msgID: MsgID?.BC_TAP_CARD_PIN,
                msgSubID: MsgSubID?.NOTIFY,
                dutyNumber: '9999',
            },
        },
        {
            id: 4,
            label: 'Tap Card Duty Number Wrong',
            isLatest: true,
            data: {
                msgID: MsgID?.BC_TAP_CARD_DUTY,
                msgSubID: MsgSubID?.RESPONSE,
                message: 'DUTY_NUMBER_INVALID',
                status: 3,
            },
        },
        {
            id: 4,
            label: 'Tap Card Sending Duty Number',
            isLatest: true,
            data: {
                msgID: MsgID?.BC_TAP_CARD_DUTY,
                msgSubID: MsgSubID?.RESPONSE,
                status: 1,
            },
        },

        {
            id: 4,
            label: 'MS Tap Card with error',
            isLatest: true,
            data: {
                msgID: MsgID?.MS_TAP_CARD_LOGIN,
                status: 3,
                message: 'CARD_LOGIN_FAILED',
            },
        },
        {
            id: 4,
            label: 'MS Tap Card Successfully',
            isLatest: true,
            data: {
                msgID: MsgID?.MS_TAP_CARD_LOGIN,
                timeout: 5000,
                status: 1,
            },
        },
        {
            id: 4,
            label: 'MS Tap Card Incorrect PIN',
            isLatest: true,
            data: {
                msgID: MsgID?.MS_TAP_CARD_PIN,
                msgSubID: MsgSubID?.RESPONSE,
                message: 'PIN_ERROR_INVALID',
                status: 3,
            },
        },
        {
            id: 4,
            label: 'MS Tap Card Input PIN Successfully',
            isLatest: true,
            data: {
                msgID: MsgID?.MS_TAP_CARD_PIN,
                msgSubID: MsgSubID?.RESPONSE,
                status: 1,
            },
        },

        {
            id: 4,
            label: 'Manual PIN Timer Timeout',
            isLatest: true,
            data: {
                msgID: MsgID?.MANUAL_LOGIN_PIN,
                msgSubID: MsgSubID?.NOTIFY,
                timeout: 5000,
            },
        },
        {
            id: 4,
            label: 'Manual Incorrect PIN',
            isLatest: true,
            data: {
                msgID: MsgID?.MANUAL_LOGIN_PIN2,
                msgSubID: MsgSubID?.RESPONSE,
                message: 'PIN_ERROR_INVALID',
                status: 3,
            },
        },
        {
            id: 4,
            label: 'Manual Enter PIN Terminate',
            isLatest: true,
            data: {
                msgID: MsgID?.MANUAL_LOGIN_PIN2,
                msgSubID: MsgSubID?.RESPONSE,
                message: 'PIN_ERROR_LOGIN_TERMINATE',
                status: 3,
            },
        },
        {
            id: 4,
            label: 'Manual Enter PIN Successfully',
            isLatest: true,
            data: {
                msgID: MsgID?.MANUAL_LOGIN_PIN2,
                msgSubID: MsgSubID?.RESPONSE,
                timeout: 5000,
                status: 1,
            },
        },
        {
            id: 4,
            label: 'Manual Incorrect Staff ID',
            isLatest: true,
            data: {
                msgID: MsgID?.MANUAL_LOGIN_STAFF_ID,
                msgSubID: MsgSubID?.RESPONSE,
                message: 'STAFF_ID_ERROR_INVALID',
                status: 3,
            },
        },
        {
            id: 4,
            label: 'Manual Enter Staff ID Terminate',
            isLatest: true,
            data: {
                msgID: MsgID?.MANUAL_LOGIN_STAFF_ID,
                msgSubID: MsgSubID?.RESPONSE,
                message: 'STAFF_ID_ERROR_LOGIN_TERMINATE',
                status: 3,
            },
        },
        {
            id: 4,
            label: 'Manual  Enter Staff ID In Progress',
            isLatest: true,
            data: {
                msgID: MsgID?.MANUAL_LOGIN_STAFF_ID,
                msgSubID: MsgSubID?.RESPONSE,
                status: 1,
            },
        },
        {
            id: 4,
            label: 'Manual  Enter Staff ID Successfully',
            isLatest: true,
            data: {
                msgID: MsgID?.MANUAL_LOGIN_STAFF_ID,
                msgSubID: MsgSubID?.NOTIFY,
                dutyNumber: '9999',
            },
        },
        {
            id: 4,
            label: 'Manual Duty Number Wrong',
            isLatest: true,
            data: {
                msgID: MsgID?.MANUAL_LOGIN_DUTY,
                msgSubID: MsgSubID?.RESPONSE,
                message: 'DUTY_NUMBER_INVALID',
                status: 3,
            },
        },
        {
            id: 4,
            label: 'Manual Sending Duty Number',
            isLatest: true,
            data: {
                msgID: MsgID?.MANUAL_LOGIN_DUTY,
                msgSubID: MsgSubID?.RESPONSE,
                status: 1,
            },
        },
        {
            id: 4,
            label: 'Manual Duty Number Success',
            isLatest: true,
            data: {
                msgID: MsgID?.MANUAL_LOGIN_DUTY,
                msgSubID: MsgSubID?.NOTIFY,
            },
        },

        {
            id: 6,
            label: 'Logged in',
            data: {
                status: AuthStatus?.LOGGED_IN,
            },
        },

        {
            id: 7,
            label: 'Out of service: w/info (Upgrade Reader)',
            isLatest: true,
            data: {
                msgID: MsgID?.OUT_OF_SERVICE_INFO,
                // errorKey: OutOfServiceType?.PENDING_UPGRADE_READER,
                title: 'Out of Service',
                action: 'Proceed for BEV for Login',
                message: 'TRANSFER REQUIRED',
                reason: '[KEY EXPIRED]',
                upgradeStatus: 'Pending upgrade on Reader',
            },
        },

        {
            id: 7,
            label: 'Out of service: w/info (Upgrade CV&Reader)',
            isLatest: true,
            data: {
                msgID: MsgID?.OUT_OF_SERVICE_INFO,
                // errorKey: OutOfServiceType?.PENDING_UPGRADE_CV_READER,
                title: 'Out of Service',
                action: 'Proceed for BEV for Login',
                message: 'TRANSFER REQUIRED',
                reason: '[KEY EXPIRED]',
                upgradeStatus: 'Pending upgrade on CV & Reader',
            },
        },
        {
            id: 8,
            label: 'Out of service: missing data',
            isLatest: true,
            data: {
                msgID: MsgID?.OUT_OF_SERVICE_MISSING_DATA,
                // errorKey: OutOfServiceType?.MISSING_DATA,
                title: 'Out of Service',
                message: 'Missing Data',
            },
        },
        {
            id: 9,
            label: 'Select language',
            data: {
                status: AuthStatus?.SELECT_LANGUAGE,
            },
        },
        {
            id: 10,
            label: 'Display Fare Console Setting',
            data: {
                status: AuthStatus?.FARE_CONSOLE_SETTING,
                deckType: 'SINGLE',
                blsStatus: 'ENABLE',
                time: '12:00:00',
                date: '09/09/2024',
                busId: 'SBS4567',
                complimentaryDays: 30,
                maximumcomplimentaryDays: 50,
            },
        },
        {
            id: 11,
            label: 'Tap Card Login Error',
            data: {
                status: AuthStatus?.SIGN_IN_TAP_CARD,
                error: 'Login Failed: Please tap card again or login manually.',
            },
        },
        {
            id: 12,
            label: 'Tap Card Login',
            data: {
                status: AuthStatus?.SIGN_IN_TAP_CARD,
            },
        },
        {
            id: 13,
            label: 'Turn On DAGW Operation',
            isLatest: true,
            data: {
                msgID: MsgID?.DAGW_OPERATION,
                title: dagwOperation.popMsgtitle[0],
                message: dagwOperation.popMsgtext[0],
            },
        },
        {
            id: 13,
            label: 'Turn On DAGW Operation (Success)',
            isLatest: true,
            data: {
                msgID: MsgID?.DAGW_OPERATION,
                title: dagwOperation.popMsgtitle[0],
                message: dagwOperation.popMsgtext[3],
                status: DagwOperationStatus?.SUCCESS,
            },
        },
        {
            id: 13,
            label: 'Turn On DAGW Operation (Error problem occurred) ',
            isLatest: true,
            data: {
                msgID: MsgID?.DAGW_OPERATION,
                title: dagwOperation.popMsgtitle[0],
                message: dagwOperation.popMsgtext[4],
                status: DagwOperationStatus?.FAILURE,
            },
        },
        {
            id: 13,
            label: 'Turn On DAGW Operation (Error process failed) ',
            isLatest: true,
            data: {
                msgID: MsgID?.DAGW_OPERATION,
                title: dagwOperation.popMsgtitle[0],
                message: dagwOperation.popMsgtext[5],
                status: DagwOperationStatus?.FAILURE,
            },
        },
        {
            id: 14,
            label: 'End Shift',
            isLatest: true,
            data: {
                msgID: MsgID?.END_SHIFT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus?.SUCCESS,
            },
        },

        {
            id: 15,
            label: 'Fare Console Configuration',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_CONSOLE,
                msgSubID: MsgSubID?.NOTIFY,
                deckType: {
                    id: 1,
                    label: 'Single',
                }, // if options of this is dynamic we use the deck type Id number if not we use the string label name
                blsStatus: 0,
                // time: '20:00:00',
                date: '09/09/2024',
                busId: 'SBS4567',
                complimentaryDays: 30,
                maximumcomplimentaryDays: 50,
            },
        },
        {
            id: 15,
            label: 'Commission Deck Type List',
            isLatest: true,
            data: {
                msgID: MsgID?.DECK_TYPE_LIST,
                msgSubID: MsgSubID?.RESPONSE,
                deckTypeList: [
                    { id: 1, label: 'Single' },
                    { id: 2, label: 'Double 2 Doors' },
                    { id: 3, label: 'Double 4 Doors' },
                    { id: 4, label: 'Long Bus' },
                    { id: 5, label: '1 BCV' },
                ],
            },
        },
        {
            id: 15,
            label: 'Deleting Parameters',
            isLatest: true,
            data: {
                msgID: MsgID?.DELETE_PARAMETER,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.PROGRESS,
                percentage: 50,
            },
        },
        {
            id: 15,
            label: 'Delete Parameters Success',
            isLatest: true,
            data: {
                msgID: MsgID?.DELETE_PARAMETER,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 15,
            label: 'Delete Parameters Error',
            isLatest: true,
            data: {
                msgID: MsgID?.DELETE_PARAMETER,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.ERROR,
                message: 'FAILED_TO_DELETE_ALL_PARAMETERS',
            },
        },
        {
            id: 16,
            label: 'BusId information',
            isLatest: true,
            data: {
                msgID: MsgID?.COMMISSION_BUS_ID,
                msgSubID: MsgSubID?.RESPONSE,
                busId: 'SBS4567',
                operator: {
                    id: 1,
                    label: 'SBST',
                    serviceProvider: 16,
                },
            },
        },
        {
            id: 16,
            label: 'Operator List',
            isLatest: true,
            data: {
                msgID: MsgID?.COMMISSION_OPERATOR,
                msgSubID: MsgSubID?.RESPONSE,
                operators: [
                    { id: 1, label: 'SBST', serviceProvider: 16 },
                    { id: 2, label: 'SMRT', serviceProvider: 17 },
                    { id: 3, label: 'LTAB', serviceProvider: 25 },
                    { id: 4, label: 'BDBO', serviceProvider: 26 },
                    { id: 5, label: 'LDBO', serviceProvider: 27 },
                    { id: 6, label: 'MDBO', serviceProvider: 10 },
                ],
            },
        },
        {
            id: 16,
            label: 'Submit Bus ID Success',
            isLatest: true,
            data: {
                msgID: MsgID?.COMMISSION_BUS_ID_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 16,
            label: 'Submit Bus ID Error',
            isLatest: true,
            data: {
                msgID: MsgID?.COMMISSION_BUS_ID_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.ERROR,
                message: 'PLEASE_RETRY_AGAIN',
            },
        },

        {
            id: 17,
            label: 'Commissioning In-progress',
            isLatest: true,
            data: {
                msgID: MsgID?.BOOT_UP_COMMISSIONING,
                msgSubID: MsgSubID?.NOTIFY,
                message: CommissioningType?.IN_PROGRESS,
            },
        },

        {
            id: 17,
            label: 'Commissioning Clearing All Data',
            isLatest: true,
            data: {
                msgID: MsgID?.BOOT_UP_COMMISSIONING,
                msgSubID: MsgSubID?.NOTIFY,
                message: CommissioningType?.CLEARING_ALL_DATA,
            },
        },

        {
            id: 17,
            label: 'Commissioning Completed Clear Data',
            isLatest: true,
            data: {
                msgID: MsgID?.BOOT_UP_COMMISSIONING,
                msgSubID: MsgSubID?.NOTIFY,
                message: CommissioningType?.COMPLETED_CLEANING,
            },
        },

        {
            id: 17,
            label: 'Commissioning Input Invalid Numbers',
            isLatest: true,
            data: {
                msgID: MsgID?.LOGIN_COMMISSIONING,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.ERROR,
            },
        },
        {
            id: 17,
            label: 'Commissioning Input Digit Numbers Success',
            isLatest: true,
            data: {
                msgID: MsgID?.LOGIN_COMMISSIONING,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 18,
            label: 'External Devices Loading',
            isLatest: true,
            data: {
                msgID: MsgID?.EXTERNAL_DEVICES,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.PROGRESS,
                testPrinter: {
                    status: ResponseStatus.PROGRESS,
                    message: '',
                },
                printer: {
                    status: ResponseStatus.PROGRESS,
                    message: '',
                },
                fare: {
                    status: 4,
                    message: '',
                },
                transmitter: {
                    status: 4,
                    message: '',
                },
                cv1: {
                    status: 4,
                    message: '',
                },
                cv2: {
                    status: 4,
                    message: '',
                },
                cv3: {
                    status: 4,
                    message: '',
                },
                cv4: {
                    status: 4,
                    message: '',
                },
                cv5: {
                    status: 4,
                    message: '',
                },
                cv6: {
                    status: 4,
                    message: '',
                },
            },
        },
        {
            id: 18,
            label: 'External Devices Success',
            isLatest: true,
            data: {
                msgID: MsgID?.EXTERNAL_DEVICES,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
                testPrinter: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                printer: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                fare: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                transmitter: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv1: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv2: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv3: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv4: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv5: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv6: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
            },
        },
        {
            id: 18,
            label: 'External Devices Success With Some Error Field',
            isLatest: true,
            data: {
                msgID: MsgID?.EXTERNAL_DEVICES,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
                testPrinter: {
                    status: ResponseStatus.ERROR,
                    message: 'OUT_OF_SERVICE',
                },
                printer: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                fare: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                transmitter: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv1: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv2: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv3: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv4: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv5: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv6: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
            },
        },
        {
            id: 18,
            label: 'Test Print Error',
            isLatest: true,
            data: {
                msgID: MsgID?.TEST_PRINT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.ERROR,
                message: 'OUT_OF_SERVICE',
            },
        },
        {
            id: 18,
            label: 'Test Print Progress',
            isLatest: true,
            data: {
                msgID: MsgID?.TEST_PRINT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.PROGRESS,
            },
        },
        {
            id: 18,
            label: 'Test Print Success',
            isLatest: true,
            data: {
                msgID: MsgID?.TEST_PRINT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },

        {
            id: 19,
            label: 'Display language setting',
            isLatest: true,
            data: {
                msgID: MsgID?.LANGUAGE,
                language: 'CH',
            },
        },

        {
            id: 20,
            label: 'Start trip - Get service list',
            isLatest: true,
            data: {
                msgID: MsgID?.START_TRIP_GET_SERVICE_LIST,
                msgSubID: MsgSubID?.RESPONSE,
                services: [
                    { serviceNumber: 12, dir: 1, variantName: 'A1' },
                    { serviceNumber: 13, dir: 2, variantName: 'A LP2' },
                    { serviceNumber: 14, dir: 3, variantName: 'C DR3' },
                    { serviceNumber: 15, dir: 4, variantName: 'A DR4' },
                    { serviceNumber: 16, dir: 5, variantName: 'D DR5' },
                    { serviceNumber: 17, dir: 6, variantName: 'E DR5' },
                    { serviceNumber: 18, dir: 7, variantName: 'A LP' },
                    { serviceNumber: 19, dir: 8, variantName: 'F DR1' },
                    { serviceNumber: 20, dir: 9, variantName: 'D DR3' },
                ],
            },
        },

        {
            id: 20,
            label: 'Start trip - Get bus stop list',
            isLatest: true,
            data: {
                msgID: MsgID?.START_TRIP_BUS_STOP_LIST,
                msgSubID: MsgSubID?.RESPONSE,
                busStopList: [
                    {
                        Busid: '1',
                        Name: 'Bishan Pk',
                    },
                    {
                        Busid: '2',
                        Name: 'Buspark',
                    },
                    {
                        Busid: '3',
                        Name: 'Bedok Interchange Boarding Berth 3 to 10 PK',
                    },
                    { Busid: '4', Name: 'Bendock interchange' },
                    {
                        Busid: '5',
                        Name: 'Bishan Pk 2',
                    },
                    {
                        Busid: '6',
                        Name: 'Buspark 2',
                    },
                    {
                        Busid: '7',
                        Name: 'Bedok Interchange Boarding Berth 3 to 10 PK 2',
                    },
                    { Busid: '8', Name: 'Bendock interchange 2' },
                    {
                        Busid: '9',
                        Name: 'Bishan Pk 3',
                    },
                    {
                        Busid: '10',
                        Name: 'Buspark 3',
                    },
                    {
                        Busid: '11',
                        Name: 'Bedok Interchange Boarding Berth 3 to 10 PK 3',
                    },
                    { Busid: '12', Name: 'Bendock interchange 3' },
                ],
            },
        },
        {
            id: 20,
            label: 'Start trip - Get Fare Details For BUS STOP MISMATCH',
            isLatest: true,
            data: {
                msgID: MsgID?.START_TRIP_GET_FARE_TRIP_DETAILS,
                msgSubID: MsgSubID?.RESPONSE,
                serviceNumber: 20,
                dir: 1,
                variantName: 'A LP1',
            },
        },
        {
            id: 20,
            label: 'Start trip - Input Service Success',
            isLatest: true,
            data: {
                msgID: MsgID?.START_TRIP_SUBMIT_SERVICE,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
                dir: 1,
                variantName: 'A DR1',
            },
        },
        {
            id: 20,
            label: 'Start trip - Input Service Error',
            isLatest: true,
            data: {
                msgID: MsgID?.START_TRIP_SUBMIT_SERVICE,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.ERROR,
            },
        },
        {
            id: 20,
            label: 'Start trip - Done',
            isLatest: true,
            data: {
                msgID: MsgID?.START_TRIP_SUBMIT_FARE_TRIP,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },

        {
            id: 23,
            label: 'CV - Upgrade Pending',
            isLatest: true,
            data: {
                msgID: MsgID?.CV_UPGRADE,
                status: ResponseStatus?.PROGRESS,
            },
        },
        {
            id: 23,
            label: 'CV - Upgrade Success',
            isLatest: true,
            data: {
                msgID: MsgID?.CV_UPGRADE,
                status: ResponseStatus?.SUCCESS,
            },
        },

        {
            id: 23,
            label: 'Ignition Off - Warning',
            isLatest: true,
            data: {
                msgID: MsgID?.IGNITION_OFF,
                currentTime: '2025-04-15T23:02:08+08:00',
            },
        },
        {
            id: 23,
            label: 'Ignition Off - Success',
            isLatest: true,
            data: {
                msgID: MsgID?.IGNITION_OFF,
                msgSubID: MsgSubID?.RESPONSE,
            },
        },

        {
            id: 25,
            label: 'Bus Off Route - Notify',
            isLatest: true,
            data: {
                msgID: MsgID?.BUS_OFF_ROUTE,
            },
        },
        {
            id: 26,
            label: 'Disble BLS - Notify',
            isLatest: true,
            data: {
                msgID: MsgID?.AUTO_DISABLE_BLS,
            },
        },
        {
            id: 26,
            label: 'Up/Down - Response',
            isLatest: true,
            data: {
                msgID: MsgID?.MAIN_UP_DOWN_BTN,
                msgSubID: MsgSubID?.RESPONSE,
                busStopId:
                    MainPageDummy.fareBusStopList[Math.floor(Math.random() * MainPageDummy.fareBusStopList.length)]
                        ?.Busid,
            },
        },
    ];

    maintenanceList = [
        {
            id: 16,
            label: 'Maintenance Fare Console Configuration',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_FARE_CONSOLE,
                msgSubID: MsgSubID?.RESPONSE,
                deckType: {
                    id: 1,
                    label: 'Single',
                }, // if options of this is dynamic we use the deck type Id number if not we use the string label name
                blsStatus: 2,
                time: '20:00:00',
                date: '09/09/2024',
                busId: 'SBS4567',
                complimentaryDays: 30,
                maximumcomplimentaryDays: 50,
            },
        },
        {
            id: 16,
            label: 'Maintenance Commission Deck Type List',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_DECK_TYPE_LIST,
                msgSubID: MsgSubID?.RESPONSE,
                deckTypeList: [
                    { id: 1, label: 'Single' },
                    { id: 2, label: 'Double 2 Doors' },
                    { id: 3, label: 'Double 4 Doors' },
                    { id: 4, label: 'Long Bus' },
                    { id: 5, label: '1 BCV' },
                ],
            },
        },
        {
            id: 16,
            label: 'Maintenance Deleting Parameters',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_DELETE_PARAMETER,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.PROGRESS,
                percentage: 50,
            },
        },
        {
            id: 16,
            label: 'Maintenance Delete Parameters Success',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_DELETE_PARAMETER,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 16,
            label: 'Maintenance Delete Parameters Error',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_DELETE_PARAMETER,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.ERROR,
                message: 'FAILED_TO_DELETE_ALL_PARAMETERS',
            },
        },
        {
            id: 16,
            label: 'BusId information',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_BUS_ID,
                msgSubID: MsgSubID?.RESPONSE,
                busId: 'SBS4567',
                operator: {
                    id: 1,
                    label: 'SBST',
                    serviceProvider: 16,
                },
            },
        },
        {
            id: 16,
            label: 'Operator List',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_OPERATOR,
                msgSubID: MsgSubID?.RESPONSE,
                operators: [
                    { id: 1, label: 'SBST', serviceProvider: 16 },
                    { id: 2, label: 'SMRT', serviceProvider: 17 },
                    { id: 3, label: 'LTAB', serviceProvider: 25 },
                    { id: 4, label: 'BDBO', serviceProvider: 26 },
                    { id: 5, label: 'LDBO', serviceProvider: 27 },
                    { id: 6, label: 'MDBO', serviceProvider: 10 },
                ],
            },
        },
        {
            id: 16,
            label: 'Submit Bus ID Success',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_BUS_ID_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 16,
            label: 'Submit Bus ID Error',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_BUS_ID_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.ERROR,
                message: 'PLEASE_RETRY_AGAIN',
            },
        },
        // {
        //     id: 16,
        //     label: 'Request External Devices',
        //     isLatest: true,
        //     data: {
        //         msgID: MsgID?.MAINTENANCE_EXTERNAL_DEVICES,
        //         msgSubID: MsgSubID?.RESPONSE,
        //         status: ResponseStatus.PROGRESS,
        //     },
        // },
        {
            id: 17,
            label: 'External Devices Loading',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_EXTERNAL_DEVICES,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.PROGRESS,
                testPrinter: {
                    status: ResponseStatus.PROGRESS,
                    message: '',
                },
                printer: {
                    status: ResponseStatus.PROGRESS,
                    message: '',
                },
                fare: {
                    status: 4,
                    message: '',
                },
                transmitter: {
                    status: 4,
                    message: '',
                },
                cv1: {
                    status: 4,
                    message: '',
                },
                cv2: {
                    status: 4,
                    message: '',
                },
                cv3: {
                    status: 4,
                    message: '',
                },
                cv4: {
                    status: 4,
                    message: '',
                },
                cv5: {
                    status: 4,
                    message: '',
                },
                cv6: {
                    status: 4,
                    message: '',
                },
            },
        },
        {
            id: 17,
            label: 'External Devices Success',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_EXTERNAL_DEVICES,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
                testPrinter: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                printer: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                fare: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                transmitter: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv1: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv2: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv3: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv4: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv5: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv6: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
            },
        },
        {
            id: 17,
            label: 'External Devices Success With Some Error Field',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_EXTERNAL_DEVICES,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
                testPrinter: {
                    status: ResponseStatus.ERROR,
                    message: 'OUT_OF_SERVICE',
                },
                printer: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                fare: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                transmitter: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv1: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv2: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv3: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv4: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv5: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
                cv6: {
                    status: ResponseStatus.SUCCESS,
                    message: '',
                },
            },
        },
        {
            id: 17,
            label: 'Test Print Error',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_TEST_PRINT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.ERROR,
                message: 'OUT_OF_SERVICE',
            },
        },
        {
            id: 17,
            label: 'Test Print Progress',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_TEST_PRINT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.PROGRESS,
            },
        },
        {
            id: 17,
            label: 'Test Print Success',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_TEST_PRINT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 17,
            label: 'Parameter List',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_PARAMETER,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
                parameters,
            },
        },
        {
            id: 17,
            label: 'Parameter List Loading',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_PARAMETER,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.PROGRESS,
            },
        },
        {
            id: 17,
            label: 'Parameter List Error',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_PARAMETER,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.ERROR,
                message: 'FETCH_PARAMETERS_FAILED',
            },
        },
        {
            id: 17,
            label: 'Version Info',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_VERSION_INFO,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
                versionInfoList,
            },
        },
        {
            id: 17,
            label: 'Version Info Loading',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_VERSION_INFO,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.PROGRESS,
            },
        },
        {
            id: 17,
            label: 'Version Info Error',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_VERSION_INFO,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.ERROR,
            },
        },

        {
            id: 17,
            label: 'Check App Upgrade',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_APP_UPGRADE,
                msgSubID: MsgSubID?.RESPONSE,
                upgradeStatus: true,
                version: 'BTE.A.01.00.99',
            },
        },
        {
            id: 17,
            label: 'App Upgrade In Progress',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_UPGRADE_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.PROGRESS,
            },
        },
        {
            id: 17,
            label: 'App Upgrade In Done',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_UPGRADE_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 23,
            label: 'Ignition Off - Warning',
            isLatest: true,
            data: {
                msgID: MsgID?.IGNITION_OFF,
                currentTime: '2025-04-15T23:02:08+08:00',
            },
        },
        {
            id: 23,
            label: 'Ignition Off - Success',
            isLatest: true,
            data: {
                msgID: MsgID?.IGNITION_OFF,
                msgSubID: MsgSubID?.RESPONSE,
            },
        },
        {
            id: 24,
            label: 'Notification - Success',
            isLatest: true,
            data: {
                msgID: MsgID?.MAINTENANCE_RESULT_NOTIFICATION,
                status: ResponseStatus.SUCCESS,
                message: 'INFORMATION_IS_UPDATED',
            },
        },
    ];

    fareList = [
        {
            id: 16,
            label: 'Show CV Status',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_SHOW_CV_STATUS,
                msgSubID: MsgSubID?.RESPONSE,
                cvStatus: [
                    {
                        cvNum: 1,
                        status: 1,
                        subStatus: 2,
                    },
                    {
                        cvNum: 2,
                        status: 1,
                        subStatus: 5,
                    },
                    {
                        cvNum: 3,
                        status: 2,
                    },
                    {
                        cvNum: 4,
                        status: 1,
                        subStatus: 6,
                    },
                    {
                        cvNum: 5,
                        status: 4,
                    },
                    {
                        cvNum: 6,
                        status: 5,
                    },
                ],
            },
        },
        {
            id: 16,
            label: 'CV Entry Exit',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_SET_CV_ENTRY_EXIT,
                msgSubID: MsgSubID?.RESPONSE,
                cvType: 1,
            },
        },
        {
            id: 16,
            label: 'CV Mode Control',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_CV_MODE_CONTROL,
                msgSubID: MsgSubID?.RESPONSE,
                always: true,
                normal: true,
            },
        },
        {
            id: 16,
            label: 'CV Power Control',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_CV_POWER_CTRL,
                msgSubID: MsgSubID?.RESPONSE,
                group: [
                    {
                        id: 1,
                        cvs: ['CV1', 'CV2', 'CV3'],
                        status: true,
                    },
                    {
                        id: 2,
                        cvs: ['CV4', 'CV5', 'CV6'],
                        status: false,
                    },
                ],
            },
        },
        {
            id: 16,
            label: 'Print Retention Ticket Detect Cart',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_PRINT_RETENTION_TICKET1,
                msgSubID: MsgSubID?.RESPONSE,
                cartAt: 'BV1',
            },
        },
        {
            id: 16,
            label: 'Retention Ticket Detecting Cart',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_PRINT_RETENTION_TICKET2,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.PROGRESS,
            },
        },
        {
            id: 16,
            label: 'Retention Ticket show Cart Information',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_PRINT_RETENTION_TICKET2,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
                cardDetail: {
                    id: '8002130012349305',
                    value: 40.45,
                },
            },
        },
        {
            id: 16,
            label: 'Print Status In Service',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_PRINTER_STATUS,
                msgSubID: MsgSubID?.RESPONSE,
                status: true,
            },
        },
        {
            id: 16,
            label: 'Print Status Out Of Service',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_PRINTER_STATUS,
                msgSubID: MsgSubID?.RESPONSE,
                status: false,
            },
        },
        {
            id: 25,
            label: 'Bus Off Route - Notify',
            isLatest: true,
            data: {
                msgID: MsgID?.BUS_OFF_ROUTE,
            },
        },
        {
            id: 26,
            label: 'Disble BLS - Notify',
            isLatest: true,
            data: {
                msgID: MsgID?.AUTO_DISABLE_BLS,
            },
        },
        {
            id: 27,
            label: 'Cancel Ride CV1 - In Progress',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_CANCEL_RIDE_CV1_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.PROGRESS,
            },
        },
        {
            id: 27,
            label: 'Cancel Ride CV1 - Success',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_CANCEL_RIDE_CV1_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 27,
            label: 'Cancel Ride CV2 - In Progress',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_CANCEL_RIDE_CV2_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.PROGRESS,
            },
        },
        {
            id: 27,
            label: 'Cancel Ride CV2 - Success',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_CANCEL_RIDE_CV2_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },

        {
            id: 28,
            label: 'Concession CV1 - In Progress',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_CONCESSION_CV1_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.PROGRESS,
            },
        },
        {
            id: 28,
            label: 'Concession CV1 - Success',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_CONCESSION_CV1_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
        {
            id: 28,
            label: 'Concession CV2 - In Progress',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_CONCESSION_CV2_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.PROGRESS,
            },
        },
        {
            id: 28,
            label: 'Concession CV2 - Success',
            isLatest: true,
            data: {
                msgID: MsgID?.FARE_CONCESSION_CV2_SUBMIT,
                msgSubID: MsgSubID?.RESPONSE,
                status: ResponseStatus.SUCCESS,
            },
        },
    ];

    mainPagePopUpList = Object.values(MainPagePopUp);
    startTripList = Object.values(StartTripTypes);
    currentStartTripFlow = this.startTripList[0];
    startTripNotification = true;
    connectionStatusInit = {
        connection: {
            statusBTS: false,
            statusBOLC: false,
            statusFARE: false,
            statusFMS: false,
            statusCRP: false,
        },
        trigger: {
            triggerBOLCButton: false,
        },
    };
    connectionStatus = this.connectionStatusInit;

    authData: any = {};
    maintenanceData: any = {};
    fareData: any = {};

    dagwOperation = dagwOperation;
    dagwOperationPublish = {
        title: '',
        message: '',
        percentage: 0,
        tickButton: '',
        fileName: '',
        status: null,
    };
    cvStatusChanger: any = [];
    activeCvDir: any;
    constructor(private mqttService: MqttService) {}

    onCheckboxChange(event: any, option: any) {
        if (event.checked) {
            this.cvStatusChanger.push(option);
        } else {
            this.cvStatusChanger = this.cvStatusChanger.filter((item) => item !== option);
        }
    }
    updateConnectionStatus(reset?) {
        this.mqttService?.publishWithFormat(
            this.topics?.tcToAllTabs,
            reset
                ? ''
                : {
                      messaged: this.connectionStatus.connection,
                      messageId: MessageId?.CONNECTION_STATUS,
                      messageType: MqttTypes?.BE_RESPONSE,
                  },
            { retain: true },
        );
        if (reset) {
            this.connectionStatus = this.connectionStatusInit;
        }
    }
    sendCvStatus() {
        const formatMess = this.cvStatusChanger.map((item) => ({
            cvNumber: item,
            statuses: this.activeCvDir?.map((cv) => Number(cv)),
        }));

        this.mqttService.publishWithMessageFormat({
            topic: this.topics.mainTab?.response,
            msgID: MsgID.CV_STATUS,
            msgSubID: MsgSubID?.RESPONSE,
            payload: formatMess,
        });
    }

    handleToggleStatus(field: string, msgID: number, status: boolean) {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.tcToAllTabs,
            msgID,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                [field]: status,
            },
        });
    }

    updateConnectionButton() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.response,
            msgID: MsgID.TRIGGER_BOLC_STATUS,
            msgSubID: MsgSubID.NOTIFY,
            payload: this.connectionStatus.trigger,
        });
    }

    sendAuth() {
        console.log({ authData: this.authData });
        this.mqttService.publishWithFormat(this.topics?.mainTab?.response, {
            messaged: this.authData,
            messageId: MessageId?.AUTH,
            messageType: MqttTypes?.BE_RESPONSE,
        });
    }
    sendRedirect() {
        // console.log(this.authData);
        const { msgID, msgSubID, ...payload } = this.authData;
        this.mqttService.publishWithMessageFormat({
            topic: this.getTopicByMsgID(msgID) || this.topics?.mainTab?.response,
            msgID: msgID,
            msgSubID: msgSubID || MsgSubID?.NOTIFY,
            payload: payload || this.authData,
        });
    }

    sendMaintenanceRedirect() {
        // console.log(this.authData);
        const { msgID, msgSubID, ...payload } = this.maintenanceData;

        this.mqttService.publishWithMessageFormat({
            topic: this.getTopicByMsgID(msgID) || this.topics?.maintenance?.response,
            msgID: msgID,
            msgSubID: msgSubID || MsgSubID?.NOTIFY,
            payload,
        });
    }

    sendFareRedirect() {
        const { msgID, msgSubID, ...payload } = this.fareData;

        this.mqttService.publishWithMessageFormat({
            topic: this.getTopicByMsgID(msgID) || this.topics?.fareTab?.response,
            msgID: msgID,
            msgSubID: msgSubID || MsgSubID?.NOTIFY,
            payload,
        });
    }

    sendStartTripFlow() {
        const data = {};

        if (
            this.currentStartTripFlow === StartTripTypes.FMS_VALID_INFO ||
            StartTripTypes.FMS_TRIP_INFO_MISMATCH === this.currentStartTripFlow ||
            StartTripTypes.FMS_BUS_STOP_MISMATCH === this.currentStartTripFlow
        ) {
            data['serviceNumber'] = 20;
            data['variantName'] = 'A LP';
            data['dir'] = 1;
            data['busStop'] = {
                Busid: '1',
                Name: 'Bus Stop 1',
            };
        }

        this.mqttService.publishWithMessageFormat({
            topic: this.getTopicByMsgID(MsgID.START_TRIP),
            msgID: this.startTripNotification ? MsgID.START_TRIP_INFORMATION_FOR_SPECIAL_CASE : MsgID.START_TRIP,
            msgSubID: this.startTripNotification ? MsgSubID.NOTIFY : MsgSubID?.RESPONSE,
            payload: {
                type: this.currentStartTripFlow,
                ...data,
            },
        });
    }

    sendMainPagePop() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.response,
            msgID: MsgID?.START_TRIP_POP_UP_MESSAGE,
            msgSubID: MsgSubID?.NOTIFY,
            payload: {
                type: this.currentMainPagePop,
            },
        });
    }

    private getTopicByMsgID(msgID: number) {
        let topic = '';
        switch (msgID) {
            case MsgID?.BOOT_UP:
            case MsgID.OUT_OF_SERVICE_INFO:
            case MsgID.OUT_OF_SERVICE_MISSING_DATA:
            case MsgID.TRIGGER_DAGW_OPERATION:
            case MsgID.TRIGGER_BOLC_STATUS:
            case MsgID.SD_FOR_UPGRADING_FROM_TO:
            case MsgID?.BUS_OPERATION_MENU:
            case MsgID.BC_TAP_CARD_LOGIN:
            case MsgID.BC_TAP_CARD_PIN:
            case MsgID.BC_TAP_CARD_DUTY:
            case MsgID.MS_TAP_CARD_LOGIN:
            case MsgID.MS_TAP_CARD_PIN:
            case MsgID.END_SHIFT:
            case MsgID?.MANUAL_LOGIN_PIN:
            case MsgID?.MANUAL_LOGIN_PIN2:
            case MsgID?.MANUAL_LOGIN_STAFF_ID:
            case MsgID?.MANUAL_LOGIN_DUTY:
            case MsgID?.END_TRIP:
            case MsgID?.END_TRIP_TYPE:
            case MsgID?.END_TRIP_SUBMIT:
            case MsgID?.END_TRIP_SUBMIT_REASON:
            case MsgID?.END_TRIP_SUBMIT_COMP_TICKET:
            case MsgID?.END_TRIP_SUBMIT_BREAKDOWN_TICKET:
            case MsgID?.CV_STATUS:
            case MsgID?.MAIN_PAGE_DATA:
            case MsgID.UPDATE_FARE_BUS_STOP:
            case MsgID.UPDATE_FMS_BUS_STOP:
            case MsgID?.UPDATE_FARE_BUS_STOP_LIST:
            case MsgID.BOOT_UP_COMMISSIONING:
            case MsgID?.LOGIN_COMMISSIONING:
            case MsgID?.LANGUAGE:
            case MsgID.START_TRIP:
            case MsgID.START_TRIP_BUS_STOP_LIST:
            case MsgID.START_TRIP_GET_SERVICE_LIST:
            case MsgID?.START_TRIP_GET_FARE_TRIP_DETAILS:
            case MsgID?.START_TRIP_SUBMIT_FARE_TRIP:
            case MsgID?.MAIN_FREE_SUBMIT:
            case MsgID?.MAIN_REAR_DOORS_SUBMIT:
            case MsgID?.LOCK:
            case MsgID?.LOCK_CONFIRM:
            case MsgID?.UNLOCK_SUBMIT:
            case MsgID?.CV_UPGRADE:
                topic = this.topics?.mainTab?.response;
                break;
            case MsgID?.MAINTENANCE_PARAMETER:
            case MsgID?.MAINTENANCE_APP_UPGRADE:
            case MsgID?.MAINTENANCE_UPGRADE_SUBMIT:
            case MsgID?.MAINTENANCE_VERSION_INFO:
                // case MsgID?.IGNITION_OFF:
                topic = this.topics?.maintenance?.response;
                break;
            case MsgID?.FARE_SHOW_CV_STATUS:
            case MsgID?.FARE_CV_POWER_CTRL:
            case MsgID?.FARE_SET_CV_ENTRY_EXIT:
            case MsgID?.FARE_CV_MODE_CONTROL:
            case MsgID?.FARE_PRINT_RETENTION_TICKET:
            case MsgID?.FARE_PRINT_RETENTION_TICKET1:
            case MsgID?.FARE_PRINT_RETENTION_TICKET2:
            case MsgID?.FARE_PRINTER_STATUS:
                topic = this.topics?.fareTab?.response;
                break;
            case MsgID.SHUTTING_DOWN:
                topic = this.topics?.tcToAllTabs;
                break;
            default:
                break;
        }
        return topic;
    }

    ngOnInit() {
        // Connect to the broker
        this.mqttService.connect();

        // Handle connection status updates
        this.mqttService.connectionStatus$.subscribe((status) => {
            this.isConnected = status;
            if (status === true) {
                console.log('Successfully connected to the broker.');
                this.isLoading = false;
            } else if (status === false) {
                console.log('Still trying to connect...');
                this.isLoading = true;
            }
        });

        // Ensure the configuration is loaded before using topics
        this.mqttService.mqttConfigLoaded$.subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
                console.log('MQTT config is loaded:', this.topics);
            }
        });
    }

    connectToBroker() {
        this.isLoading = true;
        if (this.brokerUrl) {
            this.mqttService.initializeClient(this.brokerUrl);
        }
    }

    sendIcon() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.mainTab?.response,
            msgID: MsgID.CV_ICONS,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                icon: this.activeIcon,
                error: this.isError,
                cvNum: this.cvUrl,
                message: this.cvErrorMsg,
            },
        });
    }
    compareObjects(o1: any, o2: any): boolean {
        return o1 && o2 ? o1.id === o2.id : o1 === o2;
    }
    sendDirRoute() {
        const mess = JSON.stringify(this.currentRoute);
        this.mqttService.publish(this.topics.busDirInfo?.response, mess);
    }

    sendUpdateFmsBusStop() {
        const payload = {
            ...this.fmsBusStop,
        };
        if (this.fmsBusStop.updateBusStopList) {
            payload['fmsBusStopList'] = [
                {
                    Busid: '57021',
                    Name: 'Sembawang Road Blk 241',
                    time: '09:48',
                },
                {
                    Busid: '57011',
                    Name: 'Opp Sembawang Park',
                    time: '09:50',
                },
                {
                    Busid: '57001',
                    Name: 'Sembawang Park',
                    time: '09:53',
                },
            ];
        }
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.response,
            msgID: MsgID.UPDATE_FMS_BUS_STOP,
            msgSubID: MsgSubID.NOTIFY,
            payload,
        });
    }

    sendCurrentFareBusStop() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.response,
            msgID: MsgID.UPDATE_FARE_BUS_STOP,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                Busid: this.currentRoute.fareBusStop,
                manualBls: this.manualBls,
                misMatch: this.misMatch,
                index: Number(this.fareBusStopIndex),
            },
        });
    }
    sendHeadTime() {
        // console.log('send', this.headTimeTTable);

        // this.mqttService.publishWithFormat(this.topics?.currentVehicleJourney?.response, {
        //     messaged: { ...this.headTimeTTable, color: this.timeHeadColor[this.headTimeTTable?.color] },
        //     requestType: MqttTypes?.BE_RESPONSE,
        //     messageId: MessageId?.VEHICLE_JOURNEY,
        // });

        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.response,
            msgID: MsgID.UPDATE_HEADWAY,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                ...this.headTimeTTable,
                color: this.timeHeadColor[this.headTimeTTable?.color],
            },
        });
    }
    sendNextBusInfo() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.response,
            msgID: MsgID.NEXT_BUS_INFO,
            msgSubID: MsgSubID.NOTIFY,
            payload: this.nextBusInfo,
        });
    }

    sendDagwOperation() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.response,
            msgID: MsgID.DAGW_OPERATION,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                ...this.dagwOperationPublish,
                percentage: this.dagwOperationPublish?.percentage
                    ? Number(this.dagwOperationPublish?.percentage)
                    : undefined,
            },
        });
    }

    onRouteChange(data: any, dir: string) {
        console.log('routchange', data, dir);
        this.currentRoute = {
            ...this.currentRoute,
            [dir]: data,
        };
    }

    onIconTypeChange(icon: string) {
        this.activeIcon = icon;
    }

    onCvNumberChange(cvUrl: string) {
        this.cvUrl = cvUrl;
    }

    replaceUnderscore(e: string) {
        return e.replace(/_/g, ' ');
    }
}
