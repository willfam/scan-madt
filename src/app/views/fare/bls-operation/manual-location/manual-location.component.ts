import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';

@Component({
    standalone: true,
    selector: 'manual-location',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        TranslateModule,
        ConfirmDialogComponent,
        CustomKeyboardComponent,
    ],
    templateUrl: './manual-location.component.html',
    styleUrls: ['./manual-location.component.scss'],
})
export class ManualLocationComponent implements OnInit {
    step: number;
    success: boolean = true;

    constructor(private router: Router) {
        this.step = 1;
    }

    ngOnInit() {}

    goBack() {
        this.router.navigate(['/fare/bls-operation']);
    }

    handleSelect() {
        this.step = 2;
    }

    handleChangeMode(isConfirm: boolean) {
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
