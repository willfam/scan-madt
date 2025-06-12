export const parameters = Array.from({ length: 20 }, (_, idx) => ({
    fullName: `Cash Fare parameter ${idx * 1000 + 1}`,
    version: (idx * 100 + 234).toString(),
    date: '25/03/2025',
    time: '12:00:00',
    status: idx % 2 ? 'active' : 'inactive',
}));

export const versionInfoList = [
    { device: 'BFC', software: 'BFC.A.05.22.00', readerFirmware: '' },
    { device: 'BEV1', software: 'BFC.A.05.22.00', readerFirmware: 'CTR.A.06.08.01' },
    { device: 'BEV2', software: 'BFC.A.05.22.00', readerFirmware: 'CTR.A.06.08.01' },
    { device: 'BXV1', software: 'BFC.A.05.22.00', readerFirmware: 'CTR.A.06.08.01' },
    { device: 'BXV2', software: 'BFC.A.05.22.00', readerFirmware: 'CTR.A.06.08.01' },
    { device: 'BXV3', software: 'BFC.A.05.22.00', readerFirmware: 'CTR.A.06.08.01' },
    { device: 'BXV4', software: 'BFC.A.05.22.00', readerFirmware: 'CTR.A.06.08.01' },
    { device: 'BXV5', software: 'BFC.A.05.22.00', readerFirmware: 'CTR.A.06.08.01' },
    { device: 'BXV6', software: 'BFC.A.05.22.00', readerFirmware: 'CTR.A.06.08.01' },
    { device: 'BXV7', software: 'BFC.A.05.22.00', readerFirmware: 'CTR.A.06.08.01' },
    { device: 'BXV8', software: 'BFC.A.05.22.00', readerFirmware: 'CTR.A.06.08.01' },
];

export const blsList = [
    { name: 'BLS_VER', status: '01.79.07' },
    { name: 'LONGITUDE', status: '0000000000' },
    { name: 'LATITUDE', status: '0000000000' },
    { name: 'BLS_CALIBRATOR_FACTOR', status: '457' },
    { name: 'ODOMETER_READING', status: '11132m' },
    { name: 'ODOMETER', status: 'NOT_CALIBRATED' },
    { name: 'GPS_ANTENNA', status: 'FAULT' },
    { name: 'NO_OF_DOORS', status: '2' },
    { name: 'AUTO_LOC', status: 'ENABLE' },
    { name: 'DR_CALIBRATION', status: 'NOT_CALIBRATED' },
    { name: 'TEMPERATURE', status: 'N_A' },
    { name: 'GYRO_SWITCH', status: 'FIXED' },
];

export const auditRegistrationList = [
    { name: 'NUMBER_OF_CASH_TXN', value: 0 },
    { name: 'TOTAL_CASH', value: 0 },
    { name: 'NUMBER_OF_BUS_TRIPS', value: 0 },
    { name: 'NUMBER_OF_BUS_BREAKDOWN', value: 0 },
    { name: 'OUT_OF_SERVICES', value: 0 },
    { name: 'NUMBER_OF_CLOCK_DRIFT', value: 0 },
    { name: 'NUMBER_OF_STORAGE_FULL', value: 0 },
];

export const fareConsole = {
    deckType: 'SINGLE',
    blsStatus: 'ENABLE',
    time: '12:00:00',
    date: '09/09/2024',
    busId: 'SBS4567',
    complimentaryDays: 30,
    maximumcomplimentaryDays: 50,
};

export const deckTypeList = [
    { id: 1, name: 'Single' },
    { id: 2, name: 'Double 2 Doors' },
    { id: 3, name: 'Double 4 Doors' },
    { id: 4, name: 'Long Bus' },
    { id: 5, name: '1 BCV' },
];
