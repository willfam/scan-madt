import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'maintenance-calibrate-bls-manual-input',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        ConfirmDialogComponent,
        CustomKeyboardComponent,
        TranslateModule,
    ],
    templateUrl: './calibrate-bls-manual-input.component.html',
    styleUrls: ['./calibrate-bls-manual-input.component.scss'],
})
export class CalibrateBLSManualInputComponent implements OnInit {
    inputValue: string;
    step: number;
    success: boolean;

    constructor(private router: Router) {
        this.inputValue = '';
        this.step = 1;
        this.success = true;
    }

    ngOnInit() {}

    goBack() {
        this.router.navigate(['/maintenance/fare/calibrate-bls']);
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
            this.step = 2;
        } else {
            const keyValue = target.innerText.trim();
            inputField.value = value.slice(0, start) + keyValue + value.slice(end);
            inputField.selectionStart = inputField.selectionEnd = start + keyValue.length;
        }

        inputField.focus();
    }

    handleConfirm(isConfirm: boolean) {
        if (isConfirm) {
            // this.step = 3;
            this.handleFinish();
        } else {
            this.step = 1;
            this.inputValue = '';
        }
    }

    handleFinish() {
        this.router.navigate(['/maintenance/fare/calibrate-bls']);
    }
}
