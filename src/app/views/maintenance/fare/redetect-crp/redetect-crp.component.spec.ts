import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RedetectCRPComponent } from './redetect-crp.component';
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

describe('RedetectCRPComponent', () => {
    let component: RedetectCRPComponent;
    let fixture: ComponentFixture<RedetectCRPComponent>;

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
                RedetectCRPComponent, // Import the standalone component here
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RedetectCRPComponent);
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
