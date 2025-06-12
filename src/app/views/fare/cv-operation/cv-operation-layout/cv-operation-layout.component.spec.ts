import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CVOperationLayoutComponent } from './cv-operation-layout.component';
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
describe('CVOperationLayoutComponent', () => {
    let component: CVOperationLayoutComponent;
    let fixture: ComponentFixture<CVOperationLayoutComponent>;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CVOperationLayoutComponent, // The component you want to test
                RouterTestingModule, // RouterTestingModule to handle routing
            ],
            providers: [
                { provide: Store, useClass: MockStore }, // Provide the MockStore to solve the Store dependency issue
                { provide: MqttService, useValue: mockMqttService },
            ],
            schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements and attributes in the component template
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CVOperationLayoutComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy(); // Ensure the component is created
    });
});
