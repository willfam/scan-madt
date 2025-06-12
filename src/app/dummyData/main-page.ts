import { AuthStatus, CvStatusType } from '@models';

export default {
    busServiceNum: '103m',
    plateNum: 'SBS3327',
    spid: 'LDBO(27)',
    dir: 2,
    km: '30.5',
    fmsBusStopList: [
        {
            Busid: '57059',
            Name: 'Opp Sembawang Air Base',
            time: '09:39',
            flag: 'now',
            aitp: true,
        },
        {
            Busid: '57051',
            Name: 'Sembawang MRT Station Exit A',
            time: '09:42',
            flag: 'next',
        },
        {
            Busid: '57041',
            Name: 'Sembawang Way Blk 404',
            time: '09:44',
        },
        {
            Busid: '57031',
            Name: 'Sembawang Crescent Blk 115',
            time: '09:46',
        },
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
        {
            Busid: '56991',
            Name: 'Sembawang Drive Blk 441',
            time: '09:55',
        },
        {
            Busid: '56981',
            Name: 'Sembawang Road Blk 435',
            time: '09:58',
        },
        {
            Busid: '56971',
            Name: 'Opp Sembawang Hill Park',
            time: '10:00',
        },
        {
            Busid: '56961',
            Name: 'Sembawang Hill Park',
            time: '10:02',
        },
    ],
    fareBusStopList: [
        {
            Busid: '57059',
            Name: 'Opp Sembawang Air Base',
            km: '1.2',
            flag: 'disabled',
        },
        {
            Busid: '57051',
            Name: 'Sembawang MRT Station Exit A',
            km: '2.2',
            flag: 'disabled',
        },
        {
            Busid: '57041',
            Name: 'Sembawang Way Blk 404',
            km: '1',
            flag: 'disabled',
        },
        {
            Busid: '57031',
            Name: 'Sembawang Crescent Blk 115',
            km: '12.2',
            flag: 'disabled',
        },
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
            flag: 'disabled',
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
            flag: 'active',
            misMatch: true,
            manualBls: true,
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
    cvList: [
        {
            cvNumber: 1,
            statuses: [1],
        },
        {
            cvNumber: 2,
            statuses: [1],
        },
        {
            cvNumber: 3,
            statuses: [1],
        },
        {
            cvNumber: 4,
            statuses: [1],
        },
        {
            cvNumber: 5,
            statuses: [1],
        },
        {
            cvNumber: 6,
            statuses: [1],
        },
    ],
};

export const headwayTimeTable = {
    currentBlock: '---/--',
    isHeadway: true,
    minSec: '00:00',
    bars: 1, // 0 to 6 0 will not show any bars
    direction: 'left', // left and right, If isHeadway is false, and the direction is left, the bar will move upwards; if the direction is right, the bar will move downwards."
    color: '0x000000', // green, blue, orange, black
};

export const nextBusInfo = {
    show: false,
    busBehindOccupancy: 1,
    busBehindTime: 260,
};

export const cvIconsCount = {
    busDoorStatus: [
        {
            doorNumber: 1,
            status: 'disconnected', // expected value connected | disconneted | no-tapping
            toggleCv: 'entry', // expected value entry | exit | entry-exit
            isFree: false, // expected value true | false
        },
        {
            doorNumber: 2,
            status: 'disconnected',
            toggleCv: 'entry', // expected value entry | exit | entry-exit
            isFree: false, // expected value true | false
        },
    ],
};

export const bootUp = {
    softwareVersion: 'BFC.A.05.22.00',
    osVersion: '02.02.23',
    releaseDate: '10/11/2024',
    serialNumber: '3252234785',
    service: 'SMRT',
    busId: 'SG5451',
};

export const fareConsole = {
    status: AuthStatus?.FARE_CONSOLE_SETTING,
    deckType: 'SINGLE',
    blsStatus: 'ENABLE',
    time: '12:00:00',
    date: '09/09/2024',
    busId: 'SBS4567',
    complimentaryDays: 30,
    maximumcomplimentaryDays: 50,
};

export const dagwOperation = {
    popMsgtitle: ['DAGW Operation'],
    popMsgtext: [
        'Attempting to connect\n to DAGW network',
        'Uploading file...',
        'Downloading file...',
        'DAGW Process Done',
        'Problem occurred while trying to \nconnect to wireless network. \nPlease retry again.',
        'DAGW Process Failed.\nPleaser retry again later.',
        'Processing Data',
    ],
    fileNames: ['DF_20250113_02343_0342_BFC.DAT', 'ABT_EWLA.SYS'],
    percentage: 0,
};

export const services = [
    { serviceNumber: 12, dir: 1 },
    { serviceNumber: 13, dir: 2 },
    { serviceNumber: 14, dir: 3 },
    { serviceNumber: 15, dir: 4 },
    { serviceNumber: 16, dir: 2 },
    { serviceNumber: 17, dir: 2 },
    { serviceNumber: 19, dir: 3 },
    { serviceNumber: 20, dir: 1 },
    { serviceNumber: 21, dir: 5 },
];

export const cvData = [
    {
        cvNumber: 1,
        status: CvStatusType[1],
    },
    {
        cvNumber: 2,
        status: CvStatusType[2],
    },
    {
        cvNumber: 3,
        status: CvStatusType[3],
    },
    {
        cvNumber: 4,
        status: CvStatusType[4],
    },
    {
        cvNumber: 5,
        status: CvStatusType[5],
    },
    {
        cvNumber: 6,
        status: CvStatusType[6],
    },
];

export const busStopList = [
    {
        Busid: 12779,
        Name: ' BUSPARK',
        km: '10.2',
        flag: 'active',
    },
    {
        Busid: 12778,
        Name: 'BISHAN INT BOARDING 2',
        km: '10.2',
        flag: 'active',
    },
    {
        Busid: 12239,
        Name: 'BLK 115',
        km: '10.2',
        flag: 'active',
    },
    {
        Busid: 12789,
        Name: 'BLK 210',
        km: '10.2',
        flag: 'active',
    },
    {
        Busid: 15779,
        Name: 'BLK 155',
        km: '10.2',
        flag: 'active',
    },
];

export const currentFmsTrip = {
    serviceNumber: 14,
    dir: 2,
    busStop: {
        Busid: 13669,
        Name: 'Buspark',
        km: '10.2',
        flag: 'active',
    },
};
