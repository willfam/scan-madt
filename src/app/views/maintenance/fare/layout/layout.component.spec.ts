import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FareLayoutComponent } from './layout.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule, NavigationEnd } from '@angular/router';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';

import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';

// Mock Store
class MockStore {
    select = jasmine.createSpy().and.returnValue(of({})); // Mocking select method to return an empty object
    dispatch = jasmine.createSpy(); // Mocking dispatch if needed in the future
}

class MockMqttService {
    connectionStatus$ = of(true);
    mqttConfigLoaded$ = of(true);

    mqttConfig = {
        topics: {},
    };

    subscribe = jasmine.createSpy('subscribe');
    publish = jasmine.createSpy('publish');
}

describe('FareLayoutComponent (Standalone)', () => {
    let component: FareLayoutComponent;
    let fixture: ComponentFixture<FareLayoutComponent>;
    let mockRouter: any;
    let mockActivatedRoute: any;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        mockRouter = {
            events: of(new NavigationEnd(1, '/maintenance/fare', '/maintenance/fare')),
        };

        mockActivatedRoute = {
            _routerState: {
                snapshot: {
                    url: '/maintenance/fare',
                },
            },
        };

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                RouterModule.forRoot([]), // Provide an empty routing module
                BreadcrumbComponent,
                FareLayoutComponent, // Import the standalone component here
            ],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Store, useClass: MockStore }, // Provide the MockStore to solve the Store dependency issue
                { provide: MqttService, useValue: mockMqttService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FareLayoutComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should set the active menu on init', () => {
        component.ngOnInit();
        expect(component.activeMenu).toEqual(component.menus[0]); // The first menu should be active for the root route
    });

    it('should handle menu activation based on the route', () => {
        // Simulating a route that should activate a specific menu
        mockActivatedRoute['_routerState'].snapshot.url = '/maintenance/fare/view-parameter';

        // Call the method to check the active menu
        component.checkActiveMenu(mockActivatedRoute);

        // Find the expected menu based on the route
        const expectedMenu = component.menus.find((m) => m.route === '/view-parameter');

        // Ensure that the expected menu exists before asserting
        expect(expectedMenu).toBeDefined('Expected menu should exist for the route');

        // Only assert if expectedMenu is defined
        if (expectedMenu) {
            expect(component.activeMenu).toEqual(expectedMenu);
        } else {
            fail('Expected menu not found for the route');
        }
    });

    it('should set the active menu to the first one if the current URL is the base fare route', () => {
        mockActivatedRoute['_routerState'].snapshot.url = '/maintenance/fare';
        component.checkActiveMenu(mockActivatedRoute);

        expect(component.activeMenu).toEqual(component.menus[0]); // Ensure first menu is set active
    });

    it('should not change active menu if URL does not match any menu', () => {
        mockActivatedRoute['_routerState'].snapshot.url = '/some/other/route';
        const previousActiveMenu = component.activeMenu;
        component.checkActiveMenu(mockActivatedRoute);

        expect(component.activeMenu).toBe(previousActiveMenu); // Ensure active menu remains unchanged
    });
});
