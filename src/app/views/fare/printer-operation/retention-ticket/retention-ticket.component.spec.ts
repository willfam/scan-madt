import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrinterOffComponent } from './retention-ticket.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

describe('PrinterOffComponent', () => {
    let component: PrinterOffComponent;
    let fixture: ComponentFixture<PrinterOffComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatIconModule,
                RouterTestingModule, // Use RouterTestingModule to mock the router
                PrinterOffComponent, // Import the standalone component
            ],
            providers: [
                { provide: Router, useClass: MockRouter }, // Provide the mock router
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PrinterOffComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router); // Get the mock router instance
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate back to /ticketing/device-operation/printer when goBack is called', () => {
        component.goBack();
        expect(router.navigate).toHaveBeenCalledWith(['/ticketing/device-operation/printer']);
    });

    it('should set step to 2 when handleSelect is called', () => {
        component.handleSelect();
        expect(component.step).toBe(2);
    });

    it('should reset step to 1 when handleFinish is called', () => {
        component.handleFinish();
        expect(component.step).toBe(1);
    });

    it('should have success property set to true', () => {
        expect(component.success).toBeTrue();
    });
});
