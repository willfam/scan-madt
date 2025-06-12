// src/app/views/maintenance/fare/fare-console/gyro-switch/gyro-switch.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GyroSwitchComponent } from './gyro-switch.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('GyroSwitchComponent', () => {
    let component: GyroSwitchComponent;
    let fixture: ComponentFixture<GyroSwitchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatIconModule,
                RouterModule,
                ConfirmDialogComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                GyroSwitchComponent, // Include the component here in imports
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GyroSwitchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize step to 1', () => {
        expect(component.step).toBe(1);
    });

    it('should set step to 2 when handleSelect is called', () => {
        component.handleSelect();
        expect(component.step).toBe(2);
    });

    it('should reset step to 1 when handleFinish is called', () => {
        component.handleFinish();
        expect(component.step).toBe(1);
    });
});
