import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BusOperationMenuComponent } from './bus-operation-menu.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('BusOperationMenuComponent', () => {
    let component: BusOperationMenuComponent;
    let fixture: ComponentFixture<BusOperationMenuComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                BusOperationMenuComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                HttpClientModule,
            ], // Import the standalone component
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(BusOperationMenuComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should have three buttons for bus operations', () => {
        expect(component.bustOperationButtons.length).toBe(2);
    });

    it('should navigate to /main when backToMain is called', () => {
        const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
        component.backToMain();
        expect(navigateSpy).toHaveBeenCalledWith(['/main']);
    });
});
