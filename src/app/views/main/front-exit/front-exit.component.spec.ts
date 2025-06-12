import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrontExitComponent } from './front-exit.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { updateActiveCVs } from '@app/store/main/main.reducer'; // Ensure this path is correct

describe('FrontExitComponent', () => {
    let component: FrontExitComponent;
    let fixture: ComponentFixture<FrontExitComponent>;
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
            imports: [FrontExitComponent],
            providers: [
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: Store, useValue: storeMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FrontExitComponent);
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
        expect(router.navigate).toHaveBeenCalledWith(['/main']);
    });

    it('should reset exitMode on goBack', () => {
        component.exitMode = 'CV1';
        component.goBack();
        expect(component.exitMode).toBe('');
    });

    it('should dispatch updateActiveCVs and navigate to main on handleUpdateCV', () => {
        component.exitMode = 'CV1';
        component.handleUpdateCV(true);
        expect(store.dispatch).toHaveBeenCalledWith(updateActiveCVs({ payload: [1] }));
        expect(router.navigate).toHaveBeenCalledWith(['/main']);
    });

    it('should not dispatch updateActiveCVs when isExit is false', () => {
        component.exitMode = 'CV1';
        component.handleUpdateCV(false);
        expect(store.dispatch).not.toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/main']);
    });
});
