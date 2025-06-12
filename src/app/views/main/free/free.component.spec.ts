import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreeComponent } from './free.component';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { updateFreeCVs } from '@app/store/main/main.reducer'; // Ensure this path is correct
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { routerUrls } from '@app/app.routes';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('FreeComponent', () => {
    let component: FreeComponent;
    let fixture: ComponentFixture<FreeComponent>;
    let router: Router;
    let store: Store;

    beforeEach(async () => {
        const routerMock = {
            navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)),
        };

        const storeMock = {
            dispatch: jasmine.createSpy('dispatch'),
            select: () => of([]), // Mock the select method if needed
        };

        await TestBed.configureTestingModule({
            imports: [
                FreeComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
            providers: [
                { provide: Router, useValue: routerMock },
                { provide: Store, useValue: storeMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FreeComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        store = TestBed.inject(Store);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to main on backToMain', () => {
        component.backToMain();
        expect(router.navigate).toHaveBeenCalledWith([routerUrls?.private?.main?.busStopInformation]);
    });

    it('should dispatch updateFreeCVs and navigate back to main on handleFreeRideMode', () => {
        component.handleFreeRideMode();
        expect(store.dispatch).toHaveBeenCalledWith(updateFreeCVs({ payload: [1, 2, 3, 4, 5, 6] }));
        expect(router.navigate).toHaveBeenCalledWith([routerUrls?.private?.main?.busStopInformation]);
    });
});
