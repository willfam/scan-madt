import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FareCalLabels, FareCalData } from '@models';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';
import { CustomRadioButtonComponent } from '@components/custom-radio-button/custom-radio-button.component';
import { StrNum } from '@models';
import { dummyFareCalData, dummyTableLabels } from '@dummyData/fare-calculator';
import { TranslateModule } from '@ngx-translate/core';
import { routerUrls } from '@app/app.routes';

@Component({
    selector: 'cash-payment',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        NgScrollbarModule,
        MatIconModule,
        ConfirmDialogComponent,
        DialogComponent,
        CustomKeyboardComponent,
        CustomRadioButtonComponent,
        TranslateModule,
    ],
    templateUrl: './cash-payment.component.html',
    styleUrls: ['./cash-payment.component.scss'],
})
export class CashPaymentComponent {
    fareMode: string = 'single';
    singleCashValue: number = 0;
    cashType: string = '';
    quantity: number = 0;
    adultValues: number[] = [120, 140, 160, 180, 200, 220, 230, 240, 250];
    seniorValues: number[] = [100, 130, 150];
    childValues: number[] = [65, 85, 105];
    quantityList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    tableLabels: FareCalLabels[] = dummyTableLabels;
    tableData: FareCalData[] = dummyFareCalData;
    step = 0;
    progress: number;
    inputValue: string;

    public calculationMode: boolean = false;
    public calculationStep: number = 0;
    public selectedBusStop: StrNum = '';
    popUpTitle = '';

    busStops = [
        { id: 'busPark', label: 'BUSPARK', adultFare: 1.7, childFare: 0.85, seniorFare: 1.2 },
        { id: 'bib2', label: 'BISHAN INT BOARDING 2', adultFare: 1.7, childFare: 0.85, seniorFare: 1.2 },
        { id: 'blk115', label: 'BLK 115', adultFare: 1.7, childFare: 0.85, seniorFare: 1.2 },
        { id: 'obs', label: 'OPP BISHAN STN', adultFare: 1.7, childFare: 0.85, seniorFare: 1.2 },
        { id: 'blk210', label: '1 BLK 210', adultFare: 1.7, childFare: 0.85, seniorFare: 1.2 },
        { id: '17Dir', label: '17 - Dir', adultFare: 1.7, childFare: 0.85, seniorFare: 1.2 },
        { id: '18Dir', label: '18 - Dir', adultFare: 1.7, childFare: 0.85, seniorFare: 1.2 },
        { id: '19Dir', label: '19 - Dir', adultFare: 1.7, childFare: 0.85, seniorFare: 1.2 },
        { id: '20Dir', label: '20 - Dir', adultFare: 1.7, childFare: 0.85, seniorFare: 1.2 },
    ];

    constructor(
        private router: Router,
        private activeRouter: ActivatedRoute,
    ) {
        this.progress = 0;
        this.inputValue = '';
    }

    handleBtnClick(mode: string) {
        this.step = 0;
        this.fareMode = mode;
    }

    handleCloseCalculation() {
        this.fareMode = 'single';
    }

    handleCloseBusStopPopUp() {
        this.calculationStep = 1;
    }

    handleSelectExitBusStop(selected: StrNum) {
        this.selectedBusStop = selected;
    }

    handleConfirmExitBusStop() {
        if (!this.selectedBusStop) {
            return;
        }
        this.calculationStep = this.calculationStep + 1;
    }

    fareCalculatorBack() {
        this.calculationStep = 0;
        this.selectedBusStop = '';
    }

    handleChangeBusStop(type: string) {
        this.calculationStep = 2;
        this.popUpTitle = type === 'entry' ? 'CHANGE_ENTRY_BUS_STOP' : 'CHANGE_EXIT_BUS_STOP';
    }

    handleConfirmChangeBusStop() {
        this.calculationStep = 1;
    }

    setFareMode(mode: string): void {
        this.fareMode = mode;
    }

    setCash(cashType: string, value: number): void {
        this.cashType = cashType;
        this.singleCashValue = value;

        if (this.fareMode === 'multi' && this.singleCashValue !== 0) {
            this.step = 1;
        }
        // if (this.singleCashValue !== 0) {
        //     this.step = 1;
        // }
    }

    setQuantity(quantity: number): void {
        this.quantity = quantity;
    }

    backToMain(): void {
        this.router.navigate([routerUrls?.private?.main?.busStopInformation]);
    }

    goBack(): void {
        this.singleCashValue = 0;
        this.quantity = 0;
        this.step = 0;
    }

    handleChangeInput(event: Event): void {
        const inputField = <HTMLInputElement>document.getElementById('inputField');
        const start = inputField?.selectionStart || 0;
        const end = inputField?.selectionEnd || 0;
        const value = inputField.value;
        const target = <HTMLDivElement>event.target;

        if (target.id === 'backspaceKey') {
            if (start === end) {
                // No selection, just delete the character before the cursor
                inputField.value = value.slice(0, start - 1) + value.slice(end);
                inputField.selectionStart = inputField.selectionEnd = start - 1;
                this.quantity = Number(value.slice(0, start - 1) + value.slice(end));
            } else {
                // There is a selection, delete the selected text
                inputField.value = value.slice(0, start) + value.slice(end);
                inputField.selectionStart = inputField.selectionEnd = start;
                this.quantity = Number(value.slice(0, start) + value.slice(end));
            }
        } else if (target.id === 'enterKey') {
            if (!value) return;
            this.inputValue = value;
            this.quantity = Number(value);
            this.handlePrintingTicket();
        } else {
            const keyValue = target.innerText.trim();
            inputField.value = value.slice(0, start) + keyValue + value.slice(end);
            inputField.selectionStart = inputField.selectionEnd = start + keyValue.length;
            this.quantity = Number(value.slice(0, start) + keyValue + value.slice(end));
        }

        inputField.focus();
    }

    handlePrintingTicket() {
        // this.step = 2;
        // const interval = setInterval(() => {
        //     this.progress += 20;
        //     if (this.progress >= 100) {
        //         clearInterval(interval);
        //         this.step = 3;
        //     }
        // }, 500);
    }

    handleFinish(): void {
        this.router.navigate([routerUrls?.private?.main?.busStopInformation]);
    }
}
