import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';

@Component({
    standalone: true,
    selector: 'printer-on',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        ReactiveFormsModule,
        ConfirmDialogComponent,
        CustomKeyboardComponent,
    ],
    templateUrl: './printer-on.component.html',
    styleUrls: ['./printer-on.component.scss'],
})
export class PrinterOnComponent implements OnInit {
    step: number;
    success: boolean = true;

    constructor(private router: Router) {
        this.step = 1;
    }

    ngOnInit() {}

    // goBack() {
    //     this.router.navigate(['/ticketing/device-operation/printer']);
    // }

    handleSelect() {
        this.step = 2;
    }

    handleFinish() {
        this.step = 1;
    }
}
