import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetBLSComponent } from './reset-bls.component';
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

describe('ResetBLSComponent', () => {
    let component: ResetBLSComponent;
    let fixture: ComponentFixture<ResetBLSComponent>;

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
                ResetBLSComponent, // Import the standalone component here
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ResetBLSComponent);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have initial step value of 1', () => {
        expect(component.step).toBe(1);
    });

    it('should set step to 2 when handleSelect is called', () => {
        component.handleSelect();
        expect(component.step).toBe(2);
    });

    it('should reset step to 1 when handleFinish is called', () => {
        component.handleSelect(); // First, change the step to 2
        component.handleFinish(); // Then call handleFinish
        expect(component.step).toBe(1);
    });

    it('should call ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});
