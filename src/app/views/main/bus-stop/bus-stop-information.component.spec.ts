import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusStopInformationComponent } from './bus-stop-information.component';
import { Store, StoreModule } from '@ngrx/store';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { IFmsBusStop, IUserInfoMain, ICurrenNowDest, ICurrentFareBusStop } from '@models';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppState } from '@store/app.state';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
    currentFareBusStop,
    busStopList,
    busStopFareId,
    userInfo,
    currentDir,
    fareBusStopList,
    selectBusStop,
    updateFareBusStop,
} from '@store/main/main.reducer';

describe('BusStopInformationComponent', () => {
    let component: BusStopInformationComponent;
    let fixture: ComponentFixture<BusStopInformationComponent>;
    let store: Store<AppState>;
    let router: Router;

    const mockBusStops: IFmsBusStop[] = [
        { Busid: '1', Name: 'Bus Stop 1', time: '09:00' },
        { Busid: '2', Name: 'Bus Stop 2', time: '09:10' },
    ];

    const mockUserInfo: IUserInfoMain = { spid: 'user-1', busServiceNum: '130m' };
    const mockCurrentFareBusStop: ICurrentFareBusStop = { current: '1' };
    const mockCurrentDir: ICurrenNowDest = { now: '1', dest: '2' };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                StoreModule.forRoot({}),
                NgScrollbarModule,
                TranslateModule.forRoot(),
                BusStopInformationComponent, // Import the standalone component here
            ],
            providers: [
                {
                    provide: Store,
                    useValue: {
                        select: jasmine.createSpy().and.callFake((selector) => {
                            switch (selector) {
                                case currentFareBusStop:
                                    return of(mockCurrentFareBusStop);
                                case busStopList:
                                    return of(mockBusStops);
                                case userInfo:
                                    return of(mockUserInfo);
                                case currentDir:
                                    return of(mockCurrentDir);
                                case fareBusStopList:
                                    return of(mockBusStops); // Simulate fareBusStopList
                                default:
                                    return of([]);
                            }
                        }),
                        dispatch: jasmine.createSpy(),
                    },
                },
                { provide: Router, useValue: { navigate: jasmine.createSpy() } },
            ],
            schemas: [NO_ERRORS_SCHEMA], // To avoid issues with unrecognized HTML elements
        }).compileComponents();

        store = TestBed.inject(Store);
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(BusStopInformationComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        jasmine.clock().install(); // If you need to mock time-based operations
        fixture.detectChanges();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with correct values from the store', () => {
        component.ngOnInit(); // Ensure that ngOnInit gets called
        fixture.detectChanges();
        expect(component.allBusStopList).toEqual(mockBusStops);
        expect(component.currentUserIfo).toEqual(mockUserInfo);
        expect(component.fareBusStop).toEqual(mockBusStops[0]);
    });

    it('should handle the display of bus stop fare correctly', () => {
        component.handleDisplayBusStopFare();
        expect(component.displayBusStopFare).toBeTrue();
    });

    it('should close the bus stop fare display correctly', () => {
        component.handleCloseBusStopFare();
        expect(component.displayBusStopFare).toBeFalse();
        expect(component.displayCfmBusStopFare).toBeFalse();
    });

    it('should handle change of bus stop fare correctly', () => {
        const busStop: IFmsBusStop = mockBusStops[0];
        component.handleChangeBusStopFare(busStop);
        expect(component.selectFareBusStop).toEqual(busStop.Busid);
        expect(component.displayCfmBusStopFare).toBeTrue();
    });

    it('should confirm the bus stop fare correctly', () => {
        component.selectFareBusStop = '';
        component.handleConfirmBusStopFare(true);

        expect(store.dispatch).toHaveBeenCalledWith(updateFareBusStop({ payload: '' }));
        expect(component.displayBusStopFare).toBeFalse();
        expect(component.displayCfmBusStopFare).toBeFalse();
    });

    it('should cancel the bus stop fare confirmation correctly', () => {
        component.handleConfirmBusStopFare(false);
        expect(component.displayBusStopFare).toBeTrue();
        expect(component.displayCfmBusStopFare).toBeFalse();
    });

    it('should scroll to the selected element when ngDoCheck triggers', () => {
        spyOn(component, 'scrollToElement');
        component.currentNowNext = ['1', '2'];
        component.hasUpdate = true;
        component.ngDoCheck();
        expect(component.scrollToElement).toHaveBeenCalledWith('1');
    });

    it('should select a bus stop and navigate to the correct route', () => {
        const busStop: IFmsBusStop = mockBusStops[0];
        component.selectBusStop(busStop);
        expect(router.navigate).toHaveBeenCalledWith([`/main/bus-stop-fare/${busStop.Busid}`]);
        expect(store.dispatch).toHaveBeenCalledWith(selectBusStop({ payload: busStop }));
    });

    it('should handle the case when the currentNowNext list is empty in ngDoCheck', () => {
        spyOn(component, 'scrollToElement');
        component.currentNowNext = [];
        component.hasUpdate = true;
        component.ngDoCheck();
        expect(component.scrollToElement).not.toHaveBeenCalled();
    });
});
