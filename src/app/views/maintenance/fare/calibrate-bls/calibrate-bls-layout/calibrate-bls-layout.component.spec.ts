import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CalibrateBLSLayoutComponent } from './calibrate-bls-layout.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterOutlet } from '@angular/router';

describe('CalibrateBLSLayoutComponent', () => {
    let component: CalibrateBLSLayoutComponent;
    let fixture: ComponentFixture<CalibrateBLSLayoutComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommonModule, MatIconModule, RouterModule, RouterOutlet, CalibrateBLSLayoutComponent],
            providers: [{ provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }],
        }).compileComponents();

        fixture = TestBed.createComponent(CalibrateBLSLayoutComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should have router instance injected', () => {
        expect(router).toBeTruthy();
    });
});
