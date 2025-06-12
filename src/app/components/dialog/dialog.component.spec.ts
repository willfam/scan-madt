import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
    template: `<app-dialog><p>Hello World</p></app-dialog>`,
})
class TestHostComponent {}

describe('DialogComponent', () => {
    let component: DialogComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [DialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        component = fixture.debugElement.query(By.directive(DialogComponent)).componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render content projected into it', () => {
        const content = fixture.debugElement.query(By.css('.lta-dialog-main')).nativeElement;
        expect(content.textContent).toContain('Hello World');
    });
});
