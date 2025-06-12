import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ShowCVStatusComponent } from './show-cv-status.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('ShowCVStatusComponent', () => {
    let component: ShowCVStatusComponent;
    let fixture: ComponentFixture<ShowCVStatusComponent>;
    let mockRouter: any;

    beforeEach(async () => {
        mockRouter = {
            navigate: jasmine.createSpy('navigate'),
        };

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatIconModule,
                RouterModule.forRoot([]), // Set up routing for testing
                ConfirmDialogComponent,
                ShowCVStatusComponent, // Import the standalone component
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
            providers: [{ provide: Router, useValue: mockRouter }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(ShowCVStatusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to the correct route when handleClose is called', () => {
        component.handleClose();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/fare/cv-operation']);
    });
});
