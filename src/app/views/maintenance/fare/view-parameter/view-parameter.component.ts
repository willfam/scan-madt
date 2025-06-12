import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TranslateModule } from '@ngx-translate/core';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { IViewParameter, MsgID, MsgSubID, ResponseStatus } from '@models';
import { AppState } from '@store/app.state';
import { viewParameter, updateViewParameter } from '@store/maintenance/maintenance.reducer';

@Component({
    standalone: true,
    selector: 'view-parameter',
    imports: [CommonModule, MatIconModule, RouterModule, NgScrollbarModule, TranslateModule],
    templateUrl: './view-parameter.component.html',
    styleUrls: ['./view-parameter.component.scss'],
})
export class ViewParameterComponent implements OnInit {
    sort = { fullName: 'asc', version: 'asc', date: 'asc', status: 'asc' };
    private destroy$ = new Subject<void>();
    private viewParameter$: Observable<IViewParameter>;
    viewParameter: IViewParameter = {
        parameters: [],
    };

    isLoading: boolean = true;
    ResponseStatus = ResponseStatus;
    topics;

    constructor(
        private router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        this.viewParameter$ = this.store.select(viewParameter);
    }

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
                this.mqttService.publishWithMessageFormat({
                    topic: this.topics?.maintenance?.get,
                    msgID: MsgID.MAINTENANCE_PARAMETER,
                    msgSubID: MsgSubID.REQUEST,
                    payload: {},
                });
            }
        });

        this.viewParameter$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.viewParameter = data;
            if (data && data?.parameters?.length) {
                this.isLoading = false;
            } else if (data.status === ResponseStatus.PROGRESS) {
                this.isLoading = true;
            } else if (data.status === ResponseStatus.ERROR) {
                this.isLoading = false;
            }
        });
    }

    handleSort(key: string): void {
        this.sort[key] = this.sort[key] === 'asc' ? 'desc' : 'asc';
        const nextParameters = [...this.viewParameter.parameters];
        this.store.dispatch(
            updateViewParameter({
                payload: {
                    ...this.viewParameter,
                    parameters: nextParameters.sort((a, b) => {
                        const key1 = a[key]?.toUpperCase();
                        const key2 = b[key]?.toUpperCase();
                        const sortResult = key1.localeCompare(key2, undefined, { numeric: true, sensitivity: 'base' });
                        return this.sort[key] === 'asc' ? sortResult : sortResult * -1;
                    }),
                },
            }),
        );
    }

    handleRetry(): void {
        this.isLoading = true;
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.maintenance?.get,
            msgID: MsgID.MAINTENANCE_PARAMETER,
            msgSubID: MsgSubID.REQUEST,
            payload: {},
        });
    }

    ngOnDestroy() {
        if (
            this.viewParameter.status === ResponseStatus.ERROR ||
            this.viewParameter.status === ResponseStatus.PROGRESS
        ) {
            this.store.dispatch(
                updateViewParameter({
                    payload: {
                        msgID: undefined,
                        status: undefined,
                        message: undefined,
                        parameters: [],
                    },
                }),
            );
        }

        // Unsubscribe from all subscriptions
        this.destroy$.next();
        this.destroy$.complete();
    }
}
