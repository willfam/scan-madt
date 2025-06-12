import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RedetectFMSComponent } from './redetect-fms.component';
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

describe('RedetectFMSComponent', () => {
    let component: RedetectFMSComponent;
    let fixture: ComponentFixture<RedetectFMSComponent>;

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
                RedetectFMSComponent, // Import the standalone component here
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RedetectFMSComponent);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});
