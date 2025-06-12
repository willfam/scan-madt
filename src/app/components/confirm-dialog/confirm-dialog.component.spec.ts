import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CONFIG } from '@app/data/constant';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

@Component({
    template: `<confirm-dialog
        [title]="title"
        [content]="content"
        [btnConfirm]="true"
        [btnCancel]="true"
        (onCancel)="handleCancel($event)"
        (onConfirm)="handleConfirm($event)"
    >
    </confirm-dialog>`,
})
class TestHostComponent {
    title = 'Test Title';
    content = 'Test Content';
    handleCancel(event: string) {}
    handleConfirm(event: string) {}
}

describe('ConfirmDialogComponent', () => {
    let component: ConfirmDialogComponent;
    let fixture: ComponentFixture<ConfirmDialogComponent>;
    let testHostFixture: ComponentFixture<TestHostComponent>;
    let cancelButton: HTMLElement;
    let confirmButton: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ConfirmDialogComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
            declarations: [TestHostComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        component = testHostFixture.debugElement.query(By.directive(ConfirmDialogComponent)).componentInstance;
        fixture = TestBed.createComponent(ConfirmDialogComponent);
        testHostFixture.detectChanges();
        fixture.detectChanges();
    });

    it('should create the ConfirmDialogComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should display title and content when provided', () => {
        const titleElement = testHostFixture.debugElement.query(By.css('.dia-log-title'));
        const contentElement = testHostFixture.debugElement.query(By.css('.dia-log-content'));

        expect(titleElement.nativeElement.textContent).toContain('Test Title');
        expect(contentElement.nativeElement.textContent).toContain('Test Content');
    });

    it('should emit onCancel when cancel button is clicked', () => {
        spyOn(testHostFixture.componentInstance, 'handleCancel');

        cancelButton = testHostFixture.debugElement.query(By.css('.button-cancel')).nativeElement;
        cancelButton.click();
        testHostFixture.detectChanges();

        expect(testHostFixture.componentInstance.handleCancel).toHaveBeenCalledWith('cancel');
    });

    it('should emit onConfirm when confirm button is clicked', () => {
        spyOn(testHostFixture.componentInstance, 'handleConfirm');

        confirmButton = testHostFixture.debugElement.query(By.css('.button-confirm')).nativeElement;
        confirmButton.click();
        testHostFixture.detectChanges();

        expect(testHostFixture.componentInstance.handleConfirm).toHaveBeenCalledWith('confirm');
    });

    it('should emit onOK when OK button is clicked', () => {
        component.btnOK = true;
        testHostFixture.detectChanges();

        const okButton = testHostFixture.debugElement.query(By.css('.button-ok')).nativeElement;
        spyOn(component.onOK, 'emit');

        okButton.click();
        testHostFixture.detectChanges();

        expect(component.onOK.emit).toHaveBeenCalledWith('ok');
    });

    it('should auto emit onOK after a timeout if btnOK is true', fakeAsync(() => {
        component.btnOK = true;
        spyOn(component.onOK, 'emit');
        component.ngAfterContentInit();
        testHostFixture.detectChanges();
        tick(CONFIG.DIALOG_TIMEOUT);
        expect(component.onOK.emit).toHaveBeenCalledWith('ok');
    }));
});
