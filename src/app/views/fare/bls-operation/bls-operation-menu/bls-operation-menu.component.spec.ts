import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BLSOperationMenuComponent } from './bls-operation-menu.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

describe('BLSOperationMenuComponent', () => {
    let component: BLSOperationMenuComponent;
    let fixture: ComponentFixture<BLSOperationMenuComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatIconModule,
                RouterTestingModule, // Use RouterTestingModule for mocking the router
                BLSOperationMenuComponent, // Import the standalone component here
            ],
            providers: [
                { provide: Router, useClass: MockRouter }, // Provide the mock router
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BLSOperationMenuComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router); // Get the instance of the mock router
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate back to /fare when goBack is called', () => {
        component.goBack();
        expect(router.navigate).toHaveBeenCalledWith(['/fare']);
    });
});
