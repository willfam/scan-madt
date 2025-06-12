import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CalibrateBLSManualInputComponent } from './calibrate-bls-manual-input.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('CalibrateBLSManualInputComponent', () => {
    let component: CalibrateBLSManualInputComponent;
    let fixture: ComponentFixture<CalibrateBLSManualInputComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatIconModule,
                RouterModule,
                ConfirmDialogComponent,
                CustomKeyboardComponent,
                CalibrateBLSManualInputComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
            providers: [{ provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }],
        }).compileComponents();

        fixture = TestBed.createComponent(CalibrateBLSManualInputComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate back to /maintenance/fare/calibrate-bls on goBack', () => {
        component.goBack();
        expect(router.navigate).toHaveBeenCalledWith(['/maintenance/fare/calibrate-bls']);
    });
    it('should handle confirmation correctly', () => {
        spyOn(component, 'handleFinish'); // Spy on goBack method
        component.handleConfirm(true);
        // expect(component.step).toBe(3);
        expect(component.handleFinish).toHaveBeenCalled();

        component.handleConfirm(false);
        expect(component.step).toBe(1);
        expect(component.inputValue).toBe('');
    });

    it('should navigate back on handleFinish', () => {
        component.handleFinish();
        expect(router.navigate).toHaveBeenCalledWith(['/maintenance/fare/calibrate-bls']);
    });
});
