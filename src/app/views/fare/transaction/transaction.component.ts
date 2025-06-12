import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { HeaderComponent } from '@components/layout/header/header.component';

@Component({
    standalone: true,
    selector: 'transaction',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        RouterModule,
        RouterOutlet,
        ConfirmDialogComponent,
        HeaderComponent,
        NgScrollbarModule,
    ],
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
    selectedCV: number = 0;
    step: number;

    constructor(private router: Router) {
        this.step = 1;
    }

    ngOnInit() {}

    goBack() {
        this.router.navigate(['/fare']);
    }

    handleSelectCV(cv: number) {
        this.selectedCV = cv;
        this.step = 2;
    }

    handleConfirmTopUpAmt(isConfirm: boolean) {
        if (isConfirm) {
            this.step = 3;
        } else {
            this.step = 1;
        }
    }

    handleFinish() {
        this.step = 1;
    }
}
