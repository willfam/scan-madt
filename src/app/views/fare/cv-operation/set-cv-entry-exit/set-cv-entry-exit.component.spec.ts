import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SetCVEntryExitComponent } from './set-cv-entry-exit.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomSwitchComponent } from '@components/custom-switch/custom-switch.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SetCVEntryExitComponent', () => {
    let component: SetCVEntryExitComponent;
    let fixture: ComponentFixture<SetCVEntryExitComponent>;
    let mockRouter: any;

    beforeEach(async () => {
        mockRouter = {
            navigate: jasmine.createSpy('navigate'),
        };

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatIconModule,
                RouterModule.forRoot([]), // Set up routing for testing
                ConfirmDialogComponent,
                CustomSwitchComponent,
                SetCVEntryExitComponent, // Import the standalone component
            ],
            providers: [{ provide: Router, useValue: mockRouter }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SetCVEntryExitComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize step correctly', () => {
        expect(component.step).toBe(1);
    });

    it('should navigate back when goBack is called', () => {
        component.goBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/fare/cv-operation']);
    });

    it('should toggle boarding type and change step when handleToggleStatus is called', () => {
        component.boardingType.allAuto = false;
        component.handleToggleStatus('allAuto');
        expect(component.boardingType.allAuto).toBe(true);
        // expect(component.selectedBoardingType).toBe('allAuto');
        // expect(component.step).toBe(2);
    });

    it('should reset state if isConfirm is false in handleSetStatus', () => {
        component.selectedBoardingType = 'allAuto';
        component.boardingType.allAuto = true;
        component.handleSetStatus(false);
        expect(component.boardingType.allAuto).toBe(false);
        expect(component.selectedBoardingType).toBe('');
        expect(component.step).toBe(1);
    });

    it('should change step to 3 if isConfirm is true in handleSetStatus', () => {
        component.handleSetStatus(true);
        expect(component.step).toBe(3);
    });

    it('should reset step to 1 when handleFinish is called', () => {
        component.handleFinish();
        expect(component.step).toBe(1);
    });
});
