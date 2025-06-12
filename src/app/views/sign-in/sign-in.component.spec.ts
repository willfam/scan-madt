import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { of } from 'rxjs';
import { Component } from '@angular/core';

// Mock Router
class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

@Component({
    selector: 'app-header',
    template: '<div></div>', // Provide an empty template for HeaderComponent
})
class MockHeaderComponent {}

describe('SignInComponent', () => {
    let component: SignInComponent;
    let fixture: ComponentFixture<SignInComponent>;
    let mockRouter: MockRouter;

    beforeEach(async () => {
        mockRouter = new MockRouter();

        await TestBed.configureTestingModule({
            imports: [
                SignInComponent,
                ReactiveFormsModule,
                MatCardModule,
                MatInputModule,
                MatButtonModule,
                BrowserAnimationsModule, // Add BrowserAnimationsModule here
            ],
            declarations: [MockHeaderComponent],
            providers: [FormBuilder, { provide: Router, useValue: mockRouter }],
        }).compileComponents();

        fixture = TestBed.createComponent(SignInComponent);
        component = fixture.componentInstance;
        component.ngOnInit(); // Ensure ngOnInit is called
    });

    it('should create the component and render without errors', () => {
        expect(component).toBeTruthy();
        fixture.detectChanges(); // Trigger change detection
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled).toBeTruthy(); // Check if the component rendered
    });

    it('should initialize form with empty values', () => {
        expect(component.form).toBeDefined();
        expect(component.form.value.username).toBe('');
        expect(component.form.value.password).toBe('');
    });
});
