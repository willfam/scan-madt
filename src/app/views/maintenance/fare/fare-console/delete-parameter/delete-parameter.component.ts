import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';
import { TranslateModule } from '@ngx-translate/core';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { IFareConsole, MsgID, MsgSubID, ResponseStatus } from '@models';
import { AppState } from '@store/app.state';
import { fareConsole, updateFareConsole } from '@store/maintenance/maintenance.reducer';
@Component({
    standalone: true,
    selector: 'delete-parameter',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        ConfirmDialogComponent,
        CustomKeyboardComponent,
        TranslateModule,
    ],
    templateUrl: './delete-parameter.component.html',
    styleUrls: ['./delete-parameter.component.scss'],
})
export class DeleteParameterComponent implements OnInit {
    private destroy$ = new Subject<void>();

    MsgID = MsgID;
    ResponseStatus = ResponseStatus;

    fareConsoleSetting$: Observable<IFareConsole>;
    fareConsoleSetting: IFareConsole = {
        deckType: {
            id: 0,
            label: '',
        },
        blsStatus: 0,
        busId: '',
        date: '',
        time: '',
        complimentaryDays: 0,
        message: '',
    };

    topics;

    constructor(
        private router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        this.fareConsoleSetting$ = this.store.select(fareConsole);
    }

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });

        this.fareConsoleSetting$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.fareConsoleSetting = data;
            console.log('this.fareConsoleSetting', this.fareConsoleSetting);
        });
    }

    goBack() {
        this.router.navigate(['/maintenance/fare/fare-console']);
    }

    // DELETE PARAMETERS HANDLE
    handleDeleteParameter() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.maintenance?.get,
            msgID: MsgID.MAINTENANCE_DELETE_PARAMETER,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
    }

    handleClearDeleteParameter() {
        this.store.dispatch(
            updateFareConsole({
                payload: { ...this.fareConsoleSetting, message: '', percentage: 0, status: undefined },
                msgID: MsgID.MAINTENANCE_FARE_CONSOLE,
            }),
        );
        this.goBack();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
