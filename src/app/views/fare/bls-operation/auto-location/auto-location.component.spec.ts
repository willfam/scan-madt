import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoLocationComponent } from './auto-location.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
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

describe('AutoLocationComponent', () => {
    let component: AutoLocationComponent;
    let fixture: ComponentFixture<AutoLocationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AutoLocationComponent, // Importing the standalone component
                RouterTestingModule,
                MatIconModule,
                ConfirmDialogComponent,
                CustomKeyboardComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AutoLocationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with step 1', () => {
        expect(component.step).toBe(1);
    });
});
