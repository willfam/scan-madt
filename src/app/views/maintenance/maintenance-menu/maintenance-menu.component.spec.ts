import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceMenuComponent } from './maintenance-menu.component';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';

class MockMqttService {
    connectionStatus$ = of(true);
    mqttConfigLoaded$ = of(true);

    mqttConfig = {
        topics: {},
    };

    subscribe = jasmine.createSpy('subscribe');
    publish = jasmine.createSpy('publish');
}
// Mock HeaderComponent
@Component({
    selector: 'app-header',
    template: '<div></div>', // Provide an empty template
})
class MockHeaderComponent {}

// Define a module for the mock component
@NgModule({
    declarations: [MockHeaderComponent],
    exports: [MockHeaderComponent],
})
class MockHeaderModule {}

// Mock TranslateService
class MockTranslateService {
    // Mock any methods or properties if needed
}

describe('MaintenanceMenuComponent', () => {
    let component: MaintenanceMenuComponent;
    let fixture: ComponentFixture<MaintenanceMenuComponent>;
    let mockMqttService: MockMqttService;

    // Mock Store
    const mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MockHeaderModule, // Use the mock module
                MaintenanceMenuComponent, // Import the standalone component here
            ],
            providers: [
                {
                    provide: TranslateService,
                    useClass: MockTranslateService, // Use the mock service
                },
                {
                    provide: Router,
                    useValue: {
                        navigate: jasmine.createSpy('navigate'),
                    },
                },
                {
                    provide: Store,
                    useValue: mockStore, // Provide the mock store
                },
                { provide: MqttService, useValue: mockMqttService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MaintenanceMenuComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
