import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';
import { MqttService } from '@services/mqtt.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MsgID, MsgSubID } from '@models';

@Component({
    standalone: true,
    selector: 'end-shift',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        ConfirmDialogComponent,
        DialogComponent,
        CustomKeyboardComponent,
        TranslateModule,
    ],
    templateUrl: './end-shift.component.html',
    styleUrls: ['./end-shift.component.scss'],
})
export class EndShiftComponent implements OnInit {
    private destroy$ = new Subject<void>();

    topics;

    constructor(
        private router: Router,
        private mqttService: MqttService,
    ) {}

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });
    }

    handleEndShift() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.END_SHIFT,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
    }

    goBack() {
        this.router.navigate(['/main/bus-operation']);
    }
}
