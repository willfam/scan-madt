import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PowerAllCVOffComponent } from './power-all-cv-off.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('PowerAllCVOffComponent', () => {
    let component: PowerAllCVOffComponent;
    let fixture: ComponentFixture<PowerAllCVOffComponent>;
    let mockRouter: any;

    beforeEach(async () => {
        mockRouter = {
            navigate: jasmine.createSpy('navigate'),
        };

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatIconModule,
                RouterModule.forRoot([]), // Set up routing for testing
                ConfirmDialogComponent,
                CustomKeyboardComponent,
                PowerAllCVOffComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }), /// Import the standalone component
            ],
            providers: [{ provide: Router, useValue: mockRouter }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(PowerAllCVOffComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize step, currentTime, and inputValue correctly', () => {
        expect(component.step).toBe(1);
        expect(component.currentTime).toBe('09:54:16');
        expect(component.inputValue).toBe('');
    });

    it('should navigate back when goBack is called', () => {
        component.goBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/fare/cv-operation']);
    });

    it('should change step to 2 when handleSelect is called', () => {
        component.handleSelect();
        expect(component.step).toBe(2);
    });

    it('should change step to 3 if isConfirm is true in handlePowerAllCVOff', () => {
        component.handlePowerAllCVOff(true);
        expect(component.step).toBe(3);
    });

    it('should reset step to 1 if isConfirm is false in handlePowerAllCVOff', () => {
        component.handlePowerAllCVOff(false);
        expect(component.step).toBe(1);
    });

    it('should reset step to 1 when handleFinish is called', () => {
        component.handleFinish();
        expect(component.step).toBe(1);
    });
});
