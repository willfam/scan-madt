import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'load-parameter',
    imports: [CommonModule, MatIconModule, RouterModule, ConfirmDialogComponent, MatProgressBarModule, TranslateModule],
    templateUrl: './load-parameter.component.html',
    styleUrls: ['./load-parameter.component.scss'],
})
export class LoadParameterComponent implements OnInit {
    progress: number;
    step: number;

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
