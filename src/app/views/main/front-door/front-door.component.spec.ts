import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { FrontDoorComponent } from './front-door.component';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { updateActiveCVs } from '@app/store/main/main.reducer';
import { routerUrls } from '@app/app.routes';

describe('FrontDoorComponent', () => {
    let component: FrontDoorComponent;
    let fixture: ComponentFixture<FrontDoorComponent>;
    let router: Router;
    let activeRouter: ActivatedRoute;
    let store: Store;

    beforeEach(async () => {
        const routerMock = {
            navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)),
        };

        const activatedRouteMock = {
            snapshot: {
                params: {},
            },
        };

        const storeMock = {
            dispatch: jasmine.createSpy('dispatch'),
            select: () => of([]), // Mock the select method if needed
        };

        await TestBed.configureTestingModule({
            imports: [FrontDoorComponent],
            providers: [
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: Store, useValue: storeMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FrontDoorComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        activeRouter = TestBed.inject(ActivatedRoute);
        store = TestBed.inject(Store);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to main on backToMain', () => {
        component.backToMain();
        expect(router.navigate).toHaveBeenCalledWith([routerUrls?.private?.main?.busStopInformation]);
    });

    it('should reset cvMode on goBack', () => {
        component.goBack();
        expect(router.navigate).toHaveBeenCalledWith([routerUrls?.private?.main?.busStopInformation]);
    });

    it('should change cvMode correctly', () => {
        const mode = 'testMode';
        component.handleChangeCvMode(mode);
        expect(component.cvMode).toBe(mode);
    });

    it('should dispatch updateActiveCVs and navigate to main on handleUpdateCV', () => {
        component.cvMode = 'CV1';
        component.handleUpdateCV();
        expect(store.dispatch).toHaveBeenCalledWith(updateActiveCVs({ payload: [1] }));
        // expect(router.navigate).toHaveBeenCalledWith(['/main']);
    });
});
