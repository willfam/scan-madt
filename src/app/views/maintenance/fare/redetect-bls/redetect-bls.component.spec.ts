import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RedetectBLSComponent } from './redetect-bls.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('RedetectBLSComponent', () => {
    let component: RedetectBLSComponent;
    let fixture: ComponentFixture<RedetectBLSComponent>;

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
                RedetectBLSComponent, // Import the standalone component here
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RedetectBLSComponent);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
