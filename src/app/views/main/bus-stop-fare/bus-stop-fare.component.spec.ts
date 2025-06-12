import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusStopFareComponent } from './bus-stop-fare.component';
import { provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { IFmsBusStop } from '@models';
import { selectedBusStop, selectBusStop } from '@app/store/main/main.reducer';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('BusStopFareComponent', () => {
    let component: BusStopFareComponent;
    let fixture: ComponentFixture<BusStopFareComponent>;
    let store: any;
    let router: Router;

    const mockBusStop: IFmsBusStop = { Busid: '1', Name: 'Test Bus Stop', time: '10:00 AM' };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                BusStopFareComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ], // Import the standalone component here
            providers: [
                provideMockStore({
                    selectors: [
                        {
                            selector: selectedBusStop,
                            value: of(mockBusStop),
                        },
                    ],
                }),
                {
                    provide: Router,
                    useValue: {
                        navigate: jasmine.createSpy('navigate'),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BusStopFareComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(Store);
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    afterEach(() => {
        store.resetSelectors();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate back to main', () => {
        component.backToMain();
        expect(router.navigate).toHaveBeenCalledWith(['/main']);
    });

    it('should navigate and dispatch selectBusStop with null when status is "cancel"', () => {
        spyOn(store, 'dispatch');
        component.handleUpdateBusStop('cancel');

        expect(store.dispatch).toHaveBeenCalledWith(selectBusStop({ payload: null }));
        expect(router.navigate).toHaveBeenCalledWith(['/main']);
    });

    it('should complete the destroy$ subject on ngOnDestroy', () => {
        const completeSpy = spyOn(component['destroy$'], 'complete').and.callThrough();
        component.ngOnDestroy();
        expect(completeSpy).toHaveBeenCalled();
    });
});
