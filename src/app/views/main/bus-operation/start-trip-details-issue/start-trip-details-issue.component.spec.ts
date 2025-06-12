import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { StartTripDetailsIssueComponent } from './start-trip-details-issue.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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

describe('StartTripDetailsIssueComponent', () => {
    let component: StartTripDetailsIssueComponent;
    let fixture: ComponentFixture<StartTripDetailsIssueComponent>;
    let mockActivatedRoute: MockActivatedRoute;
    let mockRouter: any;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                StartTripDetailsIssueComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(StartTripDetailsIssueComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
