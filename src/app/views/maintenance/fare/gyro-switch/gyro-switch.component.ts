import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'gyro-switch',
    imports: [CommonModule, MatIconModule, RouterModule, ConfirmDialogComponent, TranslateModule],
    templateUrl: './gyro-switch.component.html',
    styleUrls: ['./gyro-switch.component.scss'],
})
export class GyroSwitchComponent implements OnInit {
    step: number;

    constructor() {
        this.step = 1;
    }

    ngOnInit() {}

    handleSelect() {
        this.step = 2;
    }

    handleFinish() {
        this.step = 1;
    }
}
