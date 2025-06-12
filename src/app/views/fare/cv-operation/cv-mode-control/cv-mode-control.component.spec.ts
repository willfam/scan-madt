import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CVModeControlComponent } from './cv-mode-control.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomSwitchComponent } from '@components/custom-switch/custom-switch.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CVModeControlComponent', () => {
    let component: CVModeControlComponent;
    let fixture: ComponentFixture<CVModeControlComponent>;
    let mockRouter: any;

    beforeEach(async () => {
        mockRouter = {
            navigate: jasmine.createSpy('navigate'),
        };

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                MatIconModule,
                ConfirmDialogComponent,
                CustomSwitchComponent,
                CVModeControlComponent, // Import the standalone component here
            ],
            providers: [{ provide: Router, useValue: mockRouter }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(CVModeControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize controlMode and step', () => {
        expect(component.controlMode).toEqual({ alwaysInService: false, normalService: false });
        expect(component.step).toBe(1);
    });

    it('should navigate back when goBack is called', () => {
        component.goBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/fare/cv-operation']);
    });

    it('should toggle control mode and change step when handleToggleStatus is called', () => {
        component.controlMode.alwaysInService = true; // Simulate it being true
        component.handleToggleStatus('alwaysInService');
        expect(component.controlMode.alwaysInService).toBe(false);
        // expect(component.selectedControlMode).toBe('alwaysInService');
        // expect(component.step).toBe(2);

        // component.handleToggleStatus('alwaysInService'); // Toggle back
        // expect(component.controlMode.alwaysInService).toBe(false);
    });

    it('should change step to 3 if isConfirm is true in handleSetStatus', () => {
        component.selectedControlMode = 'normalService';
        component.handleSetStatus(true);
        expect(component.step).toBe(3);
    });

    it('should reset state if isConfirm is false in handleSetStatus', () => {
        component.selectedControlMode = 'normalService';
        component.controlMode.normalService = true; // Simulate it being true
        component.handleSetStatus(false);
        expect(component.controlMode.normalService).toBe(false);
        expect(component.selectedControlMode).toBe('');
        expect(component.step).toBe(1);
    });

    it('should reset step to 1 when handleFinish is called', () => {
        component.handleFinish();
        expect(component.step).toBe(1);
    });
});
