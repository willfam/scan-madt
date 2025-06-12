import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { DialogComponent } from '@components/dialog/dialog.component';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
    standalone: true,
    selector: 'redetect-cv',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        DialogComponent,
        ConfirmDialogComponent,
        TranslateModule,
        NgScrollbarModule,
    ],
    templateUrl: './redetect-cv.component.html',
    styleUrls: ['./redetect-cv.component.scss'],
})
export class RedetectCVComponent implements OnInit {
    progress: number;
    step: number;

    cvs = [
        { name: 'BEV1', status: 'INSTALLED', extraStatus: 'FRONT' },
        { name: 'BEV2', status: 'NOT_INSTALLED', extraStatus: 'FRONT' },
        { name: 'BXV1', status: 'NOT_INSTALLED', extraStatus: 'NOT_INSTALLED' },
        { name: 'BXV2', status: 'NOT_INSTALLED', extraStatus: 'NOT_INSTALLED' },
        { name: 'BXV3', status: 'NOT_INSTALLED', extraStatus: 'NOT_INSTALLED' },
        { name: 'BXV4', status: 'NOT_INSTALLED', extraStatus: 'NOT_INSTALLED' },
    ];

    constructor() {
        this.progress = 0;
        this.step = 1;
    }

    ngOnInit() {
        const interval = setInterval(() => {
            this.progress += 20;
            if (this.progress >= 100) {
                clearInterval(interval);
                this.step = 2;
            }
        }, 500);
    }

    handleSaveTransaction() {
        this.step = 2;
        const interval = setInterval(() => {
            this.progress += 5;
            if (this.progress >= 100) {
                clearInterval(interval);
                this.step = 3;
            }
        }, 500);
    }

    handleFinishTransaction() {
        this.step = 1;
    }
}
