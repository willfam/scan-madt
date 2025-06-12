import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CancelRideCV1CV2Component } from './cancel-ride.component';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { CvTypes, ConcessionCancelCVData, CancelConcessionData } from '@models';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

// Mocking CvTypes for test (assume CV1 is a string)
const mockCvTypes = CvTypes; // Use the `CvTypes` object directly

class MockActivatedRoute {
    snapshot = {
        data: {
            pageType: 'CV1', // Provide mock value for 'pageType'
            cvType: mockCvTypes.CV1, // Provide mock value for 'cvType'
        },
    };
}

describe('CancelRideCV1CV2Component', () => {
    let component: CancelRideCV1CV2Component;
    let fixture: ComponentFixture<CancelRideCV1CV2Component>;
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = new MockActivatedRoute(); // Use the mock for ActivatedRoute

    // Corrected mock data with literal types matching the ConcessionCancelCVData type
    const mockConcessionCancelCVData = {
        cancel: {
            CV1: {
                firstStep: {
                    title: 'CANCEL_RIDE_CV1' as const, // Matches the literal type
                    content: 'CONFIRM_TO_CANCEL_RIDE_CV1' as const,
                },
                secondStep: {
                    title: 'CANCEL_RIDE_CV1_IN_PROGRESS' as const,
                },
                thirdStep: {
                    content: 'CV1_IS_CANCELLED' as const,
                },
            },
            CV2: {
                firstStep: {
                    title: 'CANCEL_RIDE_CV2' as const, // Matches the literal type
                    content: 'CONFIRM_TO_CANCEL_RIDE_CV2' as const,
                },
                secondStep: {
                    title: 'CANCEL_RIDE_CV2_IN_PROGRESS' as const,
                },
                thirdStep: {
                    content: 'CV2_IS_CANCELLED' as const,
                },
            },
        },
    };

    beforeEach(async () => {
        // Use Object.defineProperty to mock the getter for CV1 and CV2
        Object.defineProperty(ConcessionCancelCVData, 'CV1', {
            get: jasmine.createSpy('getCV1').and.returnValue(mockConcessionCancelCVData.cancel.CV1),
        });
        Object.defineProperty(ConcessionCancelCVData, 'CV2', {
            get: jasmine.createSpy('getCV2').and.returnValue(mockConcessionCancelCVData.cancel.CV2),
        });

        // Spy on the 'cancel' getter in ConcessionCancelCVData
        Object.defineProperty(ConcessionCancelCVData, 'cancel', {
            get: jasmine.createSpy('getCancel').and.returnValue(mockConcessionCancelCVData.cancel),
        });

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: activatedRouteSpy }, // Provide the mock ActivatedRoute
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CancelRideCV1CV2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
