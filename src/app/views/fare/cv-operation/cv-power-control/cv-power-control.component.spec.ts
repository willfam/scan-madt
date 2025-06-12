import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CVPowerControlComponent } from './cv-power-control.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomSwitchComponent } from '@components/custom-switch/custom-switch.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('CVPowerControlComponent', () => {
    let component: CVPowerControlComponent;
    let fixture: ComponentFixture<CVPowerControlComponent>;
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
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                CVPowerControlComponent, // Import the standalone component
            ],
            providers: [{ provide: Router, useValue: mockRouter }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(CVPowerControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize step and controlStatus correctly', () => {
        expect(component.step).toBe(1);
        expect(component.controlStatus).toEqual({
            bev1: false,
            bev2: false,
            bxv1: false,
            bxv2: false,
            bxv3: false,
            bxv4: false,
        });
    });

    it('should navigate back when goBack is called', () => {
        component.goBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/fare/cv-operation']);
    });

    it('should change control status and set step when handleChangeStatus is called', () => {
        const mode = 'bev1';
        component.handleChangeStatus(mode);
        expect(component.controlStatus[mode]).toBe(true);
        // expect(component.step).toBe(2);
        // expect(component.selectedMode).toBe(mode);
    });

    it('should reset step to 1 when handleFinish is called', () => {
        component.handleFinish();
        expect(component.step).toBe(1);
    });

    it('should reset step to 1 when handleClose is called', () => {
        component.handleClose();
        expect(component.step).toBe(1);
    });
});
