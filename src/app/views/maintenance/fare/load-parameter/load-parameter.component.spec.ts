import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoadParameterComponent } from './load-parameter.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('LoadParameterComponent', () => {
    let component: LoadParameterComponent;
    let fixture: ComponentFixture<LoadParameterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatIconModule,
                RouterModule,
                ConfirmDialogComponent,
                MatProgressBarModule,
                LoadParameterComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoadParameterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize progress to 0 and step to 1', () => {
        expect(component.progress).toBe(0);
        expect(component.step).toBe(1);
    });

    it('should reset step to 1 when handleFinishTransaction is called', () => {
        component.handleFinishTransaction();
        expect(component.step).toBe(1);
    });
});
