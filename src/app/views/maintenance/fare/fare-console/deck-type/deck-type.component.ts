import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { SafeJsonService } from '@services/safe-json.service';
import { IFareConsole, MsgID, MsgSubID } from '@models';
import { AppState } from '@store/app.state';
import { fareConsole as currentFareConsole, updateFareConsole } from '@store/maintenance/maintenance.reducer';

@Component({
    standalone: true,
    selector: 'deck-type',
    imports: [CommonModule, RouterModule, ConfirmDialogComponent, TranslateModule, NgScrollbarModule],
    templateUrl: './deck-type.component.html',
    styleUrls: ['./deck-type.component.scss'],
})
export class DeckTypeComponent implements OnInit {
    private destroy$ = new Subject<void>();

    private fareConsoleSetting$: Observable<IFareConsole>;
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

    selectedDeckTypeId: number = 0;

    topics;

    constructor(
        private router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
        private safeJsonService: SafeJsonService,
    ) {
        this.fareConsoleSetting$ = this.store.select(currentFareConsole);
    }

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
                this.mqttService.publishWithMessageFormat({
                    topic: this.topics?.maintenance?.get,
                    msgID: MsgID.MAINTENANCE_DECK_TYPE_LIST,
                    msgSubID: MsgSubID.REQUEST,
                    payload: {},
                });
            }
        });

        this.fareConsoleSetting$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.fareConsoleSetting = data;
            this.selectedDeckTypeId = data.deckType.id;
        });
    }

    goBack() {
        this.router.navigate(['/maintenance/fare/fare-console']);
    }

    handleChangeDeckType(deckType: number) {
        this.selectedDeckTypeId = deckType;
    }

    handleConfirmDeckType() {
        if (!this.selectedDeckTypeId) {
            return;
        }

        const nextSetting = { ...this.fareConsoleSetting };
        const nextDeckType = this.fareConsoleSetting.deckTypeList?.find((deck) => deck.id === this.selectedDeckTypeId);
        if (nextDeckType) {
            nextSetting.deckType = nextDeckType;
        }

        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.maintenance?.get,
            msgID: MsgID.MAINTENANCE_DECK_TYPE_SUBMIT,
            msgSubID: MsgSubID.NOTIFY,
            payload: {
                deckType: this.selectedDeckTypeId,
            },
        });
        this.store.dispatch(
            updateFareConsole({
                payload: nextSetting,
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
