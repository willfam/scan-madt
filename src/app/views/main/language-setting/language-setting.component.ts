import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { MsgID, MsgSubID } from '@models';
import { MqttService } from '@services/mqtt.service';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { language, updateLanguage } from '@store/main/main.reducer';

@Component({
    selector: 'language-setting',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './language-setting.component.html',
    styleUrl: './language-setting.component.scss',
})
export class LanguageSettingComponent implements OnDestroy, OnInit {
    private destroy$ = new Subject<void>();

    topics;
    languageOptions = [
        { id: 'EN', label: 'English' },
        { id: 'CH', label: '中文' },
    ];

    private language$: Observable<string>;
    language: string = '';

    constructor(
        private router: Router,
        private mqttService: MqttService,
        private translate: TranslateService,
        protected store: Store<AppState>,
    ) {
        this.language$ = this.store.select(language);
    }

    ngOnInit() {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });

        this.language$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.language = data;
            this.translate.use(data?.toLocaleLowerCase());
        });
    }

    handleNavigate(page: string) {
        this.router.navigate([page]);
    }

    handleChangeLanguage(lang: string): void {
        this.language = lang;
        this.translate.use(this.language?.toLocaleLowerCase());
    }

    handleConfirmLanguage(isConfirm: boolean): void {
        if (isConfirm) {
            if (!this.language) {
                return;
            }
            this.mqttService.publishWithMessageFormat({
                topic: this.topics?.mainTab?.get,
                msgID: MsgID.LANGUAGE_SUBMIT,
                msgSubID: MsgSubID.NOTIFY,
                payload: {
                    language: this.language,
                },
            });
            this.store.dispatch(
                updateLanguage({
                    payload: {
                        language: this.language,
                    },
                    msgID: MsgID?.LANGUAGE,
                }),
            );
            this.translate.use(this.language?.toLocaleLowerCase());
        }
    }

    ngOnDestroy() {
        // Emit to destroy all active subscriptions
        this.destroy$.next();
        this.destroy$.complete();
    }
}
