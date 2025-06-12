import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomKeyboardComponent } from './custom-keyboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('CustomKeyboardComponent', () => {
    let component: CustomKeyboardComponent;
    let fixture: ComponentFixture<CustomKeyboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CustomKeyboardComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomKeyboardComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should emit onKeyPress event when a numeric key is pressed', () => {
        spyOn(component.onKeyPress, 'emit');

        component.layout = 'numeric';
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('.numeric-keyboard .btn')).nativeElement;
        button.click();

        expect(component.onKeyPress.emit).toHaveBeenCalled();
    });

    it('should change layout when switchKey1 or switchKey2 is pressed', () => {
        component.layout = 'numeric';
        fixture.detectChanges();
        component.layout = 'text';
        fixture.detectChanges();
        const switchKey1 = fixture.debugElement.query(By.css('#switchKey1'));
        expect(switchKey1).toBeTruthy();
        switchKey1.nativeElement.click();
        expect(component.layout).toBe('numeric');
        component.layout = 'text';
        fixture.detectChanges();
        const switchKey2 = fixture.debugElement.query(By.css('#switchKey2'));
        expect(switchKey2).toBeTruthy();
        switchKey2.nativeElement.click();
        expect(component.layout).toBe('numeric');
    });

    it('should emit onKeyPress event when a text key is pressed', () => {
        spyOn(component.onKeyPress, 'emit');

        component.layout = 'text';
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('.text-keyboard .btn')).nativeElement;
        button.click();
        expect(component.onKeyPress.emit).toHaveBeenCalled();
    });
});
