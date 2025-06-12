import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyTripLogComponent } from './daily-trip-log.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

describe('DailyTripLogComponent', () => {
    let component: DailyTripLogComponent;
    let fixture: ComponentFixture<DailyTripLogComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatIconModule,
                RouterTestingModule, // Use RouterTestingModule for mocking the router
                DailyTripLogComponent, // Import the standalone component here
            ],
            providers: [
                { provide: Router, useClass: MockRouter }, // Provide the mock router
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DailyTripLogComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router); // Get the instance of the mock router
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate back to /ticketing/device-operation/printer when goBack is called', () => {
        component.goBack();
        expect(router.navigate).toHaveBeenCalledWith(['/ticketing/device-operation/printer']);
    });

    it('should have a success property set to true', () => {
        expect(component.success).toBeTrue();
    });

    it('should have a handlePrint method defined', () => {
        expect(component.handlePrint).toBeDefined();
    });
});
