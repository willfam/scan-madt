import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RedetectCVComponent } from './redetect-cv.component';
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

describe('RedetectCVComponent', () => {
    let component: RedetectCVComponent;
    let fixture: ComponentFixture<RedetectCVComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatIconModule,
                RouterModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                ConfirmDialogComponent,
                RedetectCVComponent, // Import the standalone component here
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RedetectCVComponent);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize progress and step correctly', () => {
        expect(component.progress).toBe(0);
        expect(component.step).toBe(1);
    });

    it('should set step to 2 when handleSaveTransaction is called', () => {
        component.handleSaveTransaction();
        expect(component.step).toBe(2);
    });

    it('should reset step to 1 when handleFinishTransaction is called', () => {
        component.step = 3; // Set step to 3 to test the reset
        component.handleFinishTransaction();
        expect(component.step).toBe(1);
    });
});
