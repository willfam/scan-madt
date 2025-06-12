import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CalibrateBLSCalibrationComponent } from './calibrate-bls-calibration.component';
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

describe('CalibrateBLSCalibrationComponent', () => {
    let component: CalibrateBLSCalibrationComponent;
    let fixture: ComponentFixture<CalibrateBLSCalibrationComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatIconModule,
                RouterModule,
                ConfirmDialogComponent,
                CustomKeyboardComponent,
                CalibrateBLSCalibrationComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
            providers: [{ provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }],
        }).compileComponents();

        fixture = TestBed.createComponent(CalibrateBLSCalibrationComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component.inputValue).toBe('');
        expect(component.step).toBe(1);
        expect(component.isStart).toBe(false);
        expect(component.progress).toBe(0);
    });

    it('should navigate back to the correct route', () => {
        component.step = 4;
        component.goBack();
        expect(component.step).toBe(1);
        expect(component.isStart).toBe(false);

        component.step = 2;
        component.goBack();
        expect(router.navigate).toHaveBeenCalledWith(['/maintenance/fare/calibrate-bls']);
    });

    it('should toggle isStart and step during handleSelect', fakeAsync(() => {
        component.handleSelect(2);
        expect(component.isStart).toBe(true);
        expect(component.step).toBe(2);
        tick(500);
        expect(component.progress).toBe(20);
        tick(500);
        expect(component.progress).toBe(40);

        component.handleSelect(2); // Stop
        expect(component.isStart).toBe(false);
        expect(component.progress).toBe(0);
        tick(500);
    }));

    it('should handle confirmation correctly', () => {
        component.handleConfirm(true);
        expect(component.step).toBe(6);

        component.handleConfirm(false);
        expect(component.step).toBe(4);
    });

    it('should reset the process when handleFinish is called', () => {
        spyOn(component, 'goBack');
        component.handleFinish();
        expect(component.step).toBe(1);
        expect(component.inputValue).toBe('');
        expect(component.goBack).toHaveBeenCalled();
    });
});
