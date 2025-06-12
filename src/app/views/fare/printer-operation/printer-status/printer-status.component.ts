import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { IPrintStatus, MsgID, MsgSubID } from '@models';
import { AppState } from '@store/app.state';
import { printStatus } from '@store/fare/fare.reducer';

@Component({
    standalone: true,
    selector: 'printer-status',
    imports: [CommonModule, MatIconModule, RouterModule, ReactiveFormsModule],
    templateUrl: './printer-status.component.html',
    styleUrls: ['./printer-status.component.scss'],
})
export class PrinterStatusComponent implements OnInit {
    private destroy$ = new Subject<void>();

    private printStatus$: Observable<IPrintStatus>;
    printStatus: IPrintStatus = {
        status: false,
    };

    topics;

    constructor(
        private router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        this.printStatus$ = this.store.select(printStatus);
    }

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });
        this.printStatus$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.printStatus = data;

            console.log('printStatus', this.printStatus);
        });
    }

    goBack() {
        this.router.navigate(['/fare/printer-operation']);
    }
}
