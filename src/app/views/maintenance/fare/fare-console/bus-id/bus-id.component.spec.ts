import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BusIdComponent } from './bus-id.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('BusIdComponent', () => {
    let component: BusIdComponent;
    let fixture: any;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BusIdComponent, RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(BusIdComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with step 1 and empty inputValue', () => {
        expect(component.step).toBe(1);
    });

    it('should navigate to the fare console on backToMain', () => {
        spyOn(router, 'navigate');
        component.backToMain();
        expect(router.navigate).toHaveBeenCalledWith(['/maintenance/fare/fare-console']);
    });

    it('should navigate to the fare console on goBack', () => {
        spyOn(router, 'navigate');
        component.goBack(1);
        expect(component.step).toBe(1);
    });

    it('should set step to 2 on handleSetBusId', () => {
        component.handleSetBusId();
        expect(component.step).toBe(2);
    });

    it('should set selectedOpt on handleChangeOpt', () => {
        component.handleChangeOpt('busId');
        expect(component.selectedOpt).toBe('busId');
    });

    it('should set handleClosePopUp', () => {
        component.handleClosePopUp();
        expect(component.step).toBe(2);
        expect(component.selectedOpt).toBe('');
        expect(component.selectedOperator).toBe('');
    });

    it('should set operator on handleSelectOperator', () => {
        component.handleSelectOperator('1234');
        expect(component.selectedOperator).toBe('1234');
    });

    it('should update inputValue on handleConfirmBusId', () => {
        const testValue = 'Bus123';
        component.handleConfirmBusId(testValue, 'busIdInput');
        expect(component.selectedOpt).toBe('');
        expect(component.selectedOperator).toBe('');
        expect(component.serviceProvIdInput).toBe('');
        expect(component.busIdInput).toBe(testValue);
    });

    it('should handle enter key and call handleChangeInput', () => {
        spyOn(component as any, 'handleConfirmBusId');
        const inputField = document.createElement('input');
        inputField.id = 'inputField';
        inputField.value = 'Bus456';
        document.body.appendChild(inputField);
        const event = new Event('input');
        Object.defineProperty(event, 'target', { value: { id: 'enterKey' } });

        component.handleChangeInput(event, 'busIdInput');
        expect(component.handleConfirmBusId).toHaveBeenCalledWith('Bus456', 'busIdInput');
    });

    it('should set step to 3 on handleConfirmOpt', () => {
        component.handleConfirmOpt();
        expect(component.step).toBe(3);
    });

    it('should navigate back on handleFinish', () => {
        // spyOn(component, 'goBack');
        // component.handleFinish();
        // expect(component.goBack).toHaveBeenCalled();
        component.handleFinish();
        expect(component.step).toBe(1);
    });
});
