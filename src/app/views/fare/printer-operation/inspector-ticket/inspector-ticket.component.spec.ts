import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InspectorTicketComponent } from './inspector-ticket.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

describe('InspectorTicketComponent', () => {
    let component: InspectorTicketComponent;
    let fixture: ComponentFixture<InspectorTicketComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatIconModule,
                RouterTestingModule, // Use RouterTestingModule to mock the router
                InspectorTicketComponent, // Import the standalone component
            ],
            providers: [
                { provide: Router, useClass: MockRouter }, // Provide the mock router
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InspectorTicketComponent);
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

    it('should have success property set to true', () => {
        expect(component.success).toBeTrue();
    });

    it('should have a handlePrint method defined', () => {
        expect(component.handlePrint).toBeDefined();
    });
});
