import { TestBed } from '@angular/core/testing';
import { CheckPrinterComponent } from './check-printer.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('CheckPrinterComponent', () => {
    let component: CheckPrinterComponent;
    let fixture: any;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                CheckPrinterComponent, // Import the standalone component directly
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CheckPrinterComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
