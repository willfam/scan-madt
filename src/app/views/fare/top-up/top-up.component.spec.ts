import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopUpComponent } from './top-up.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs'; // Import Observable to return mock data

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

describe('TopUpComponent', () => {
    let component: TopUpComponent;
    let fixture: ComponentFixture<TopUpComponent>;
    let router: Router;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                TopUpComponent, // The component to be tested
                RouterTestingModule, // Include RouterTestingModule for routing
            ],
            providers: [
                { provide: Store, useClass: MockStore }, // Mock Store if TopUpComponent uses it
                { provide: MqttService, useValue: mockMqttService },
            ],
            schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements in the template
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TopUpComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router); // Get the injected Router
    });

    it('should create the component', () => {
        expect(component).toBeTruthy(); // Ensure the component is created
    });
});
