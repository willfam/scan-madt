import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveTransactionComponent } from './save-transaction.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('SaveTransactionComponent', () => {
    let component: SaveTransactionComponent;
    let fixture: ComponentFixture<SaveTransactionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatIconModule,
                RouterModule,
                ConfirmDialogComponent,
                MatProgressBarModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                SaveTransactionComponent, // Import the standalone component here
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveTransactionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have initial progress value of 0', () => {
        expect(component.progress).toBe(0);
    });

    it('should have initial step value of 1', () => {
        expect(component.step).toBe(1);
    });

    it('should set step to 2 when handleSaveTransaction is called', () => {
        component.handleSaveTransaction();
        expect(component.step).toBe(2);
    });

    it('should reset step to 1 when handleFinishTransaction is called', () => {
        component.handleSaveTransaction(); // First, change the step to 2
        component.handleFinishTransaction(); // Then call handleFinish
        expect(component.step).toBe(1);
    });

    it('should call ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});
