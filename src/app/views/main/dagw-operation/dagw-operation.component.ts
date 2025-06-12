import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { dagwOperation } from '@store/main/main.reducer';
import { IDagwOperation, DagwOperationStatus, MsgID } from '@models';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';
import { MqttService } from '@services/mqtt.service';
import { routerUrls } from '@app/app.routes';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
@Component({
    standalone: true,
    selector: 'dagw-operation',
    imports: [CommonModule, MatButtonModule, MatIconModule],
    templateUrl: './dagw-operation.component.html',
    styleUrls: ['./dagw-operation.component.scss'],
})
export class DagwOperationComponent implements OnInit {
    private destroy$ = new Subject<void>();
    dagwStatus = DagwOperationStatus;
    dagwOperation$: Observable<IDagwOperation>;
    dagwOperationData: IDagwOperation = {
        title: '',
        message: '',
    };

    topics;
    languageOptions = [
        { id: 'EN', label: 'English' },
        { id: 'CH', label: '中文' },
    ];
    selectedLanguage: string = '';

    private mqttSubscriptions: string[] = []; // Track MQTT topics for cleanup

    constructor(
        private router: Router,
        private store: Store<AppState>,
        iconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer,
        private mqttService: MqttService,
    ) {
        this.dagwOperation$ = this.store.select(dagwOperation);
        iconRegistry.addSvgIcon(
            'custom-x-icon',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/images/icons/main/delete.svg'),
        );
    }

    ngOnInit() {
        this.dagwOperation$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.dagwOperationData = data;
        });
    }

    handleNavigate(page: string) {
        this.router.navigate([page]);
    }

    handleChangeLanguage(lang: string): void {
        this.selectedLanguage = this.languageOptions.find((option) => option.id === lang)?.id ?? '';
    }

    handleCancel() {
        this.mqttService.publishWithMessageFormat({
            topic: this.topics?.mainTab?.get,
            msgID: MsgID.DAGW_OPERATION,
            payload: {
                triggerDAGWButton: false,
            },
        });
        this.handleNavigate(routerUrls?.private?.main?.login);
    }

    ngOnDestroy() {
        // Emit to destroy all active subscriptions
        this.destroy$.next();
        this.destroy$.complete();
    }
}
