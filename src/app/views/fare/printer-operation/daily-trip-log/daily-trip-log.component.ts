import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';

@Component({
    standalone: true,
    selector: 'daily-trip-log',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        ReactiveFormsModule,
        ConfirmDialogComponent,
        CustomKeyboardComponent,
    ],
    templateUrl: './daily-trip-log.component.html',
    styleUrls: ['./daily-trip-log.component.scss'],
})
export class DailyTripLogComponent implements OnInit {
    success: boolean = true;

    constructor(private router: Router) {}

    ngOnInit() {}

    goBack() {
        this.router.navigate(['/ticketing/device-operation/printer']);
    }

    handlePrint() {}
}
