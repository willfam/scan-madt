import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { OutOfServiceComponent } from './out-of-service.component';
import { OutOfServiceType } from '@models';
import { By } from '@angular/platform-browser';

// Mock ActivatedRoute to provide the necessary route data
class MockActivatedRoute {
    snapshot = {
        data: {
            pageType: 'mockPageType', // Mock pageType value
        },
    };
}

describe('OutOfServiceComponent', () => {
    let component: OutOfServiceComponent;
    let fixture: ComponentFixture<OutOfServiceComponent>;
    let mockActivatedRoute: MockActivatedRoute;

    beforeEach(() => {
        mockActivatedRoute = new MockActivatedRoute();

        TestBed.configureTestingModule({
            imports: [OutOfServiceComponent], // Add the standalone component here
            providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
        }).compileComponents();

        fixture = TestBed.createComponent(OutOfServiceComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should have the correct initial values for withInfo and noData', () => {
        expect(component.withInfo).toBe(OutOfServiceType.WITH_INFO);
        expect(component.noData).toBe(OutOfServiceType.NO_DATA);
    });
});
