import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CJBComponent } from './cjb.component';
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

describe('CJBComponent (Standalone)', () => {
    let component: CJBComponent;
    let fixture: ComponentFixture<CJBComponent>;
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
                CJBComponent, // Import the standalone component here
            ],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Store, useClass: MockStore }, // Provide the MockStore to solve the Store dependency issue
                { provide: MqttService, useValue: mockMqttService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CJBComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
