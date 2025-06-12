import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from '@components/layout/header/header.component';

import { Subject, takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { MsgID, MsgSubID, IAuth, LOCAL_STORAGE_KEY } from '@models';
import { AppState } from '@store/app.state';
import { LocalStorageService } from '@services/local-storage.service';

@Component({
    standalone: true,
    selector: 'log-out',
    imports: [CommonModule, MatIconModule, RouterModule, TranslateModule, HeaderComponent],
    templateUrl: './log-out.component.html',
    styleUrls: ['./log-out.component.scss'],
})
export class LogOutComponent implements OnInit {
    private destroy$ = new Subject<void>();

    auth: IAuth = {
        isLoggedIn: false,
    };
    topics;

    constructor(
        private router: Router,
        protected store: Store<AppState>,
        private mqttService: MqttService,
        private localStorageService: LocalStorageService,
    ) {}

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });

        const authStr = this.localStorageService.getItem(LOCAL_STORAGE_KEY.AUTH);
        if (authStr) {
            this.auth = JSON.parse(authStr);
        }
    }

    handleLogout(isConfirm: boolean) {
        if (isConfirm) {
            this.localStorageService.removeItem(LOCAL_STORAGE_KEY.AUTH);
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.LOGOUT,
                msgSubID: MsgSubID.NOTIFY,
                payload: {},
            });
            this.handleLogoutSuccess();
        }
        this.router.navigate(['/maintenance']);
    }

    private handleLogoutSuccess(): void {
        this.auth = { isLoggedIn: false, loggedInType: undefined };
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.mainTab?.response,
            msgID: MsgID.LOGOUT_SUCCESS,
            msgSubID: MsgSubID.NOTIFY,
        });
        this.mqttService.publishWithMessageFormat({
            topic: this.topics.fareTab?.response,
            msgID: MsgID.LOGOUT_SUCCESS,
            msgSubID: MsgSubID.NOTIFY,
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
