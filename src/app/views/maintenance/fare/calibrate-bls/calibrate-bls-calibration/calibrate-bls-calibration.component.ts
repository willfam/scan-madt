import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';

import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'maintenance-calibrate-bls-calibration',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        ConfirmDialogComponent,
        CustomKeyboardComponent,
        TranslateModule,
    ],
    templateUrl: './calibrate-bls-calibration.component.html',
    styleUrls: ['./calibrate-bls-calibration.component.scss'],
})
export class CalibrateBLSCalibrationComponent implements OnInit {
    inputValue: string;
    step: number;
    isStart: boolean;
    intervalId;
    progress: number;

    constructor(private router: Router) {
        this.inputValue = '';
        this.step = 1;
        this.isStart = false;
        this.progress = 0;
    }

    ngOnInit() {}

    goBack() {
        if (this.step === 4) {
            this.step = 1;
            this.isStart = false;
        } else {
            this.router.navigate(['/maintenance/fare/calibrate-bls']);
        }
    }

    handleSelect(step: number): void {
        this.isStart = !this.isStart;
        this.step = step;

        if (this.isStart) {
            this.intervalId = setInterval(() => {
                this.progress += 20;
                if (this.progress >= 100) {
                    clearInterval(this.intervalId);
                    this.step = 3;
                }
            }, 500);
        }

        if (!this.isStart && this.intervalId) {
            clearInterval(this.intervalId);
            this.progress = 0;
        }
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
            } else {
                // There is a selection, delete the selected text
                inputField.value = value.slice(0, start) + value.slice(end);
                inputField.selectionStart = inputField.selectionEnd = start;
            }
        } else if (target.id === 'enterKey') {
            if (!value) return;
            this.inputValue = value;
            this.step = 5;
        } else {
            const keyValue = target.innerText.trim();
            inputField.value = value.slice(0, start) + keyValue + value.slice(end);
            inputField.selectionStart = inputField.selectionEnd = start + keyValue.length;
        }

        inputField.focus();
    }

    handleConfirm(isConfirm: boolean): void {
        if (isConfirm) {
            this.step = 6;
        } else {
            this.step = 4;
        }
    }

    handleFinish() {
        this.step = 1;
        this.inputValue = '';
        this.goBack();
    }
}
