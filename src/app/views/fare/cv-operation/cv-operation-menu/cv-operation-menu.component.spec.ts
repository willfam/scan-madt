import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CVOperationMenuComponent } from './cv-operation-menu.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CVOperationMenuComponent', () => {
    let component: CVOperationMenuComponent;
    let fixture: ComponentFixture<CVOperationMenuComponent>;
    let mockRouter: any;

    beforeEach(async () => {
        mockRouter = {
            navigate: jasmine.createSpy('navigate'),
        };

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatIconModule,
                RouterModule.forRoot([]), // Set up routing for testing
                CVOperationMenuComponent, // Import the standalone component
            ],
            providers: [{ provide: Router, useValue: mockRouter }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(CVOperationMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize urlPrefix correctly', () => {
        expect(component.urlPrefix).toBe('/fare/cv-operation');
    });

    it('should navigate to /fare when goBack is called', () => {
        component.goBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/fare']);
    });
});
