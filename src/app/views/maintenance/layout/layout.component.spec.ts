import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MaintenanceLayoutComponent } from './layout.component'; // Adjust the import path as necessary
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';

// Mock Store
class MockStore {
    select = jasmine.createSpy().and.returnValue(of({})); // Mocking select method to return an empty object
    dispatch = jasmine.createSpy(); // Mocking dispatch if needed in the future
}
class RouterMock {}

class MockMqttService {
    connectionStatus$ = of(true);
    mqttConfigLoaded$ = of(true);

    mqttConfig = {
        topics: {
            maintenance: {
                get: '/madt/maintenance/fare',
                response: '/tc/maintenance/fare',
            },
        },
    };

    subscribe = jasmine.createSpy('subscribe');
    publish = jasmine.createSpy('publish');
}

describe('MaintenanceLayoutComponent', () => {
    let component: MaintenanceLayoutComponent;
    let fixture: ComponentFixture<MaintenanceLayoutComponent>;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [CommonModule, MatIconModule, MaintenanceLayoutComponent],
            providers: [
                { provide: Store, useClass: MockStore },
                { provide: Router, useClass: RouterMock },
                { provide: MqttService, useValue: mockMqttService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MaintenanceLayoutComponent);
        component = fixture.componentInstance;
        // fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the component successfully', () => {
        expect(component).toBeDefined();
    });
});
