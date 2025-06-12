import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ConcessionCV2Component } from './concession-cv2.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('ConcessionCV2Component', () => {
    let component: ConcessionCV2Component;
    let fixture: ComponentFixture<ConcessionCV2Component>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [
                MatIconModule,
                RouterTestingModule, // Using RouterTestingModule for router-related tests
                ConfirmDialogComponent,
                ConcessionCV2Component,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }), // Importing the standalone component
            ],
            providers: [
                { provide: Router, useValue: routerSpy }, // Mocking the Router
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ConcessionCV2Component);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Initial data binding
    });

    it('should initialize with step 1 and progress 0', () => {
        expect(component.step).toBe(1);
        expect(component.progress).toBe(0);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to /fare if confirmation is not given', () => {
        component.handleConfirmConcession(false);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/fare']);
    });

    it('should navigate to /fare on finish', () => {
        component.handleFinish();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/fare']);
    });
});
