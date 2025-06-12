import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartTripComponent } from './start-trip.component';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { ActivatedRoute } from '@angular/router';
// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

class MockActivatedRoute {
    snapshot = {
        data: {
            pageType: 'mockPageType', // Mock pageType value
        },
    };
}

describe('StartTripComponent', () => {
    let component: StartTripComponent;
    let fixture: ComponentFixture<StartTripComponent>;
    let mockRouter: any;
    let mockActivatedRoute: MockActivatedRoute;

    beforeEach(async () => {
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [
                StartTripComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                HttpClientModule, // Include HttpClientModule here
            ],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(StartTripComponent);
        component = fixture.componentInstance;
    });
    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
