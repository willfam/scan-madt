import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LockScreenComponent } from './lock-screen.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { CustomKeyboardComponent } from '@components/custom-keyboard/custom-keyboard.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('LockScreenComponent', () => {
    let component: LockScreenComponent;
    let fixture: ComponentFixture<LockScreenComponent>;
    let router: Router;

    beforeEach(async () => {
        const routerMock = {
            navigate: jasmine.createSpy('navigate'),
        };

        await TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                MatIconModule,
                ConfirmDialogComponent,
                DialogComponent,
                CustomKeyboardComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                LockScreenComponent, // Correctly imported here
            ],
            providers: [{ provide: Router, useValue: routerMock }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(LockScreenComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to main on backToMain()', () => {
        component.backToMain();
        expect(router.navigate).toHaveBeenCalledWith(['/main']);
    });

    it('should change step on goBack(step)', () => {
        component.goBack(2);
        expect(component.step).toBe(2);
    });

    it('should handle confirmation correctly in handleConfirm(isConfirm)', () => {
        // Set up the necessary HTML element
        const lockButton = document.createElement('div');
        lockButton.id = 'lock-btn';
        document.body.appendChild(lockButton);

        // Test confirming the action
        component.handleConfirm(true);
        expect(component.step).toBe(2);
        expect(lockButton.classList.contains('hidden')).toBe(true);

        // Test canceling the action
        component.handleConfirm(false);
        expect(router.navigate).toHaveBeenCalledWith(['/main']);

        // Cleanup: Remove the lock button from the DOM
        document.body.removeChild(lockButton);
    });

    it('should change step to 3 on handleUnlock()', () => {
        component.handleUnlock();
        expect(component.step).toBe(3);
    });
});
