import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CashPaymentComponent } from './cash-payment.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { routerUrls } from '@app/app.routes';

describe('CashPaymentComponent', () => {
    let component: CashPaymentComponent;
    let fixture: ComponentFixture<CashPaymentComponent>;
    let mockRouter: jasmine.SpyObj<Router>;

    beforeEach(() => {
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [CashPaymentComponent],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: { params: of({}) } },
            ],
            schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements
        }).compileComponents();

        fixture = TestBed.createComponent(CashPaymentComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to main on backToMain()', () => {
        component.backToMain();
        expect(mockRouter.navigate).toHaveBeenCalledWith([routerUrls?.private?.main?.busStopInformation]);
    });

    it('should set fare mode to "single" on setFareMode()', () => {
        component.setFareMode('single');
        expect(component.fareMode).toBe('single');
    });

    it('should set cash type and value on setCash()', () => {
        component.setCash('adult', 120);
        expect(component.cashType).toBe('adult');
        expect(component.singleCashValue).toBe(120);

        if (component.fareMode === 'multi' && component.singleCashValue !== 0) expect(component.step).toBe(1);
    });

    it('should reset values on goBack()', () => {
        component.singleCashValue = 50;
        component.quantity = 3;
        component.goBack();
        expect(component.singleCashValue).toBe(0);
        expect(component.quantity).toBe(0);
        expect(component.step).toBe(0);
    });
});
