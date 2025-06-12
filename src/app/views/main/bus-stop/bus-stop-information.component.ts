import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, DoCheck, ElementRef, ViewChildren, QueryList } from '@angular/core'; // Add ViewChild import here
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { NgScrollbarModule, NgScrollbar } from 'ngx-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { MqttService, Topics } from '@services/mqtt.service';
import {
    currentFareBusStop,
    busStopList,
    selectBusStop,
    busStopFareId,
    userInfo,
    currentDir,
    fareBusStopList,
    updateCurrentFareBusStop,
    deviation,
    nextBusInfo,
} from '@store/main/main.reducer';
import { AppState } from '@store/app.state';
import { Observable, Subject, combineLatest, switchMap } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import {
    IFmsBusStop,
    ICurrenNowDest,
    IDeviation,
    IUserInfoMain,
    StrNum,
    INextBusInfo,
    IFareBusStop,
    MsgID,
    MsgSubID,
} from '@models';
import {
    ConnectionStatusState,
    selectConnectionStatusState,
} from '@app/store/connection-status/connection-status.reducer';
import { ButtonSoundDirective } from '@directives/button-sound.directive';
import { constants } from 'node:http2';

@Component({
    selector: 'bus-stop-information',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        TranslateModule,
        NgScrollbarModule,
        ButtonSoundDirective,
    ],
    templateUrl: './bus-stop-information.component.html',
    styleUrls: ['./bus-stop-information.component.scss'],
    providers: [DatePipe],
})
export class BusStopInformationComponent implements OnInit, OnDestroy, DoCheck {
    private destroy$ = new Subject<void>(); // A single Subject to manage all cleanup

    displayBusStopFare = false;
    displayCfmBusStopFare = false;
    selectFareBusStop!: string;
    selectedIndex: number = -1;
    // Observables
    barCounts: number[] = [];
    currentFareBusStop$: Observable<IFareBusStop | null>;
    fareBusStop: IFareBusStop | null = null;
    fareBusStopList$: Observable<IFareBusStop[]>;
    busStopList$: Observable<IFmsBusStop[]>;
    busStopFareId$: Observable<string>;
    userInfo$: Observable<IUserInfoMain>;
    allBusStopList: IFmsBusStop[] = [];
    currentNowNext: string[] = [];
    currentUserIfo: IUserInfoMain | null = null;
    destination!: IFmsBusStop | undefined;
    currentDir$: Observable<ICurrenNowDest | null>;
    hasUpdate: boolean = false;
    deviation$: Observable<IDeviation>;
    deviation: IDeviation | null = null;
    fmsStatus: boolean | undefined = true;
    @ViewChild(NgScrollbar) scrollable?: NgScrollbar; // Now ViewChild is correctly imported
    @ViewChildren('indicatorDiv') indicatorDiv: QueryList<ElementRef> | undefined;
    nextBusInfo$: Observable<INextBusInfo>;
    connectionStatusState$: Observable<ConnectionStatusState>;

    topics;

    constructor(
        private router: Router,
        private store: Store<AppState>,
        private mqttService: MqttService,
    ) {
        // Store selectors
        this.currentFareBusStop$ = this.store.select(currentFareBusStop);
        this.fareBusStopList$ = this.store.select(fareBusStopList);
        this.busStopList$ = this.store.select(busStopList);
        this.busStopFareId$ = this.store.select(busStopFareId);
        this.userInfo$ = this.store.select(userInfo);
        this.currentDir$ = this.store.select(currentDir);
        this.deviation$ = this.store.select(deviation);
        this.nextBusInfo$ = this.store.select(nextBusInfo).pipe(takeUntil(this.destroy$));
        this.connectionStatusState$ = this.store.select(selectConnectionStatusState);
    }

    getNowNextDataById(id, data) {
        const index = data.findIndex((item) => item.Busid === id);
        if (index === -1) {
            return null;
        }
        const result = [data[index]];
        if (index < data.length - 1) {
            result.push(data[index + 1]);
        }

        return result;
    }

    getColoredBars(direction, bars) {
        const numbers: number[] = [];
        let i = ['left', 'up']?.includes(direction) ? 6 - bars + 1 : 6;
        if (['left', 'up']?.includes(direction)) {
            do {
                numbers.push(i);
                i = i + 1;
            } while (i <= 6);
        }
        if (['right', 'down']?.includes(direction)) {
            do {
                numbers.push(i);
                i = i + 1;
            } while (i >= 6 && i <= 6 + bars - 1);
        }
        return bars === 0 ? [] : numbers;
    }

    scrollToElement(elementId: string) {
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
            // Pass smooth scrolling options
            this.scrollable?.scrollToElement(targetElement);
        }
    }

    convertSecondsToMinutes(seconds: number): number {
        return Math.ceil(seconds / 60);
    }

    ngDoCheck(): void {
        if (this.currentNowNext?.length > 0 && this.hasUpdate) {
            this.indicatorDiv?.toArray().forEach((elementRef) => {
                if (elementRef.nativeElement.id === this.currentNowNext?.[0]) {
                    this.hasUpdate = false;
                    this.scrollToElement(this.currentNowNext[0]);
                }
            });
        }
    }
    filterById(data, id) {
        return data?.filter((item) => item?.Busid === id)?.[0];
    }

    ngOnInit(): void {
        this.mqttService.mqttConfigLoaded$.pipe(takeUntil(this.destroy$)).subscribe((configLoaded) => {
            if (configLoaded) {
                this.topics = this.mqttService.mqttConfig?.topics;
            }
        });

        this.deviation$.pipe(takeUntil(this.destroy$)).subscribe((devia) => {
            if (devia?.direction) {
                this.barCounts = this.getColoredBars(devia?.direction, devia?.bars);
            }
            this.deviation = devia;
        });
        // Subscribe to lineActive and busStopList observables and clean up
        this.currentFareBusStop$
            .pipe(
                takeUntil(this.destroy$), // Will automatically unsubscribe when component is destroyed
                switchMap((fareBusStop) => {
                    return combineLatest([
                        this.busStopList$,
                        this.userInfo$,
                        this.currentDir$,
                        this.fareBusStopList$,
                    ]).pipe(
                        takeUntil(this.destroy$), // Subscribe to all in parallel with a single takeUntil
                        map(([busStops, userIn, dirInfo, fareBusStopList]) => {
                            this.allBusStopList = busStops;
                            this.destination = busStops[busStops.length - 1];
                            this.currentUserIfo = userIn;
                            this.fareBusStop = fareBusStop;

                            // console.log('currentUserIfo', this.currentUserIfo);
                            // console.log('fareBusStop', fareBusStop);
                        }),
                    );
                }),
            )
            .subscribe();

        this.connectionStatusState$.pipe(takeUntil(this.destroy$))?.subscribe((status) => {
            this.fmsStatus = !status.connection?.statusFMS;
        });
    }

    formatKm(km: number | string): string {
        if (typeof km === 'number') {
            return km.toFixed(1);
        }
        if (typeof km === 'string') {
            const num = parseFloat(km);
            return isNaN(num) ? '0.0' : num.toFixed(1);
        }
        return km;
    }

    // Select bus stop and navigate
    selectBusStop(busStop: IFmsBusStop): void {
        this.router.navigate([`/main/bus-stop-fare/${busStop.Busid}`]);
        this.store.dispatch(selectBusStop({ payload: busStop }));
    }

    // Toggle visibility for bus stop fare information
    handleDisplayBusStopFare() {
        this.displayBusStopFare = true;
    }

    handleCloseBusStopFare() {
        this.displayBusStopFare = false;
        this.displayCfmBusStopFare = false;
        this.selectFareBusStop = '';
        this.selectedIndex = -1;
    }

    handleChangeBusStopFare(busStop: IFareBusStop, idx: number) {
        this.selectFareBusStop = busStop?.Busid;
        this.selectedIndex = idx;
        // this.displayBusStopFare = false;
        this.displayCfmBusStopFare = true;
    }

    handleConfirmBusStopFare(isConfirm: boolean) {
        if (isConfirm) {
            this.mqttService.publishWithMessageFormat({
                topic: this.topics.mainTab?.get,
                msgID: MsgID.MAIN_UPDATE_FARE_BUS_STOP,
                msgSubID: MsgSubID.NOTIFY,
                payload: {
                    busStopId: this.selectFareBusStop,
                    index: this.selectedIndex,
                },
            });
            this.store.dispatch(
                updateCurrentFareBusStop({
                    payload: this.selectFareBusStop,
                }),
            );
            this.displayBusStopFare = false;
            this.displayCfmBusStopFare = false;
            this.selectFareBusStop = '';
            this.selectedIndex = -1;
        } else {
            this.displayBusStopFare = true;
            this.displayCfmBusStopFare = false;
        }
    }

    // Clean up observables when component is destroyed
    ngOnDestroy() {
        // Emit to destroy all active subscriptions
        this.destroy$.next();
        this.destroy$.complete();
    }
}
