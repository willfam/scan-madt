import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSwitchComponent } from './custom-switch.component';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('CustomSwitchComponent', () => {
    let component: CustomSwitchComponent;
    let fixture: ComponentFixture<CustomSwitchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CustomSwitchComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomSwitchComponent);
        component = fixture.componentInstance;
    });

    it('should initialize with the correct checked state', () => {
        component.checked = true;
        fixture.detectChanges();
        expect(component.innerChecked).toBeTrue();
        const checkbox = fixture.debugElement.query(By.css('#toggleSwitch')).nativeElement;
        expect(checkbox.checked).toBeTrue();
    });

    it('should emit onChange event when the checkbox is clicked', () => {
        spyOn(component.onChange, 'emit');
        component.checked = false;
        fixture.detectChanges();

        const checkbox = fixture.debugElement.query(By.css('#toggleSwitch')).nativeElement;
        checkbox.click();
        fixture.detectChanges();

        expect(component.innerChecked).toBeTrue();
        expect(component.onChange.emit).toHaveBeenCalled();
    });

    it('should display "ON" when checked and displayText is true', () => {
        component.checked = true;
        component.displayText = true;
        fixture.detectChanges();

        const onText = fixture.debugElement.query(By.css('.on'));
        expect(onText).toBeTruthy();
        expect(onText.nativeElement.textContent).toContain('ON');
    });

    it('should display "OFF" when unchecked and displayText is true', () => {
        component.checked = false;
        component.displayText = true;
        fixture.detectChanges();

        const offText = fixture.debugElement.query(By.css('.off'));
        expect(offText).toBeTruthy();
        expect(offText.nativeElement.textContent).toContain('OFF');
    });

    it('should not emit event when disabled', () => {
        spyOn(component.onChange, 'emit');
        component.disabled = true;
        fixture.detectChanges();

        const checkbox = fixture.debugElement.query(By.css('#toggleSwitch')).nativeElement;
        checkbox.click();
        fixture.detectChanges();

        expect(component.onChange.emit).not.toHaveBeenCalled();
    });
});
