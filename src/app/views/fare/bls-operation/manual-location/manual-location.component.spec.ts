import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManualLocationComponent } from './manual-location.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

describe('ManualLocationComponent', () => {
    let component: ManualLocationComponent;
    let fixture: ComponentFixture<ManualLocationComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatIconModule,
                RouterTestingModule, // Use RouterTestingModule for mocking the router
                ManualLocationComponent, // Import the standalone component here
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
            providers: [
                { provide: Router, useClass: MockRouter }, // Provide the mock router
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ManualLocationComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router); // Get the instance of the mock router
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate back to /fare/bls-operation when goBack is called', () => {
        component.goBack();
        expect(router.navigate).toHaveBeenCalledWith(['/fare/bls-operation']);
    });

    it('should update step to 2 when handleSelect is called', () => {
        component.handleSelect();
        expect(component.step).toBe(2);
    });

    it('should update step to 3 when handleChangeMode is called with true', () => {
        component.handleChangeMode(true);
        expect(component.step).toBe(3);
    });

    it('should reset step to 1 when handleChangeMode is called with false', () => {
        component.handleChangeMode(false);
        expect(component.step).toBe(1);
    });

    it('should reset step to 1 when handleFinish is called', () => {
        component.handleFinish();
        expect(component.step).toBe(1);
    });
});
