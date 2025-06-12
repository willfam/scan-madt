import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrinterOperationMenuComponent } from './printer-operation-menu.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

describe('PrinterOperationMenuComponent', () => {
    let component: PrinterOperationMenuComponent;
    let fixture: ComponentFixture<PrinterOperationMenuComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatIconModule,
                RouterTestingModule,
                PrinterOperationMenuComponent, // Import the standalone component
            ],
            providers: [
                { provide: Router, useClass: MockRouter }, // Provide a mock router
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PrinterOperationMenuComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router); // Get the mock router instance
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate back to /fare when goBack is called', () => {
        component.goBack();
        expect(router.navigate).toHaveBeenCalledWith(['/fare']);
    });

    it('should navigate to the correct URL when handleNavigate is called', () => {
        const mockUrl = '/settings';
        component.handleNavigate(mockUrl);
        expect(router.navigate).toHaveBeenCalledWith([component.urlPrefix + mockUrl]);
    });

    it('should have urlPrefix set to /fare/printer-operation', () => {
        expect(component.urlPrefix).toBe('/fare/printer-operation');
    });
});
