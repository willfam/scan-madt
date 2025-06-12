import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestReceiptComponent } from './test-receipt.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

describe('TestReceiptComponent', () => {
    let component: TestReceiptComponent;
    let fixture: ComponentFixture<TestReceiptComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatIconModule,
                RouterTestingModule,
                TestReceiptComponent, // Import the standalone component
            ],
            providers: [
                { provide: Router, useClass: MockRouter }, // Provide a mock router
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestReceiptComponent);
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
});
