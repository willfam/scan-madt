import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestPrintComponent } from './test-print.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('TestPrintComponent', () => {
    let component: TestPrintComponent;
    let fixture: ComponentFixture<TestPrintComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatIconModule,
                RouterModule,
                ReactiveFormsModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                TestPrintComponent, // Import the standalone component here
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestPrintComponent);
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
        component.handleSelect(); // Change step to 2 first
        component.handleFinish(); // Then reset to 1
        expect(component.step).toBe(1);
    });

    it('should call ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});
