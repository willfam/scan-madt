import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CalibrateBLSMenuComponent } from './calibrate-bls-menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('CalibrateBLSMenuComponent', () => {
    let component: CalibrateBLSMenuComponent;
    let router: Router;
    let fixture: any;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]), // Simulates routing for the test
                CalibrateBLSMenuComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CalibrateBLSMenuComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to the provided URL when handleNavigate is called', () => {
        const navigateSpy = spyOn(router, 'navigate');
        const url = '/maintenance/fare/calibrate-bls';

        component.handleNavigate(url);

        expect(navigateSpy).toHaveBeenCalledWith([url]);
    });
});
