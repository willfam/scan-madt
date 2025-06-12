import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MqttComponent } from './mqtt.component';
import { MqttService } from '@services/mqtt.service';
import { of } from 'rxjs';
import { Component } from '@angular/core';

// Mock MqttService
class MockMqttService {
    connectionStatus$ = of(false); // Default to not connected
    mqttConfigLoaded$ = of(false); // Default to config not loaded
    connect = jasmine.createSpy('connect');
    initializeClient = jasmine.createSpy('initializeClient');
    publish = jasmine.createSpy('publish');
    disconnect = jasmine.createSpy('disconnect');
}

@Component({
    selector: 'app-header',
    template: '<div></div>', // Provide an empty template for HeaderComponent
})
class MockHeaderComponent {}

describe('MqttComponent', () => {
    let component: MqttComponent;
    let fixture: ComponentFixture<MqttComponent>;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [MqttComponent], // Add MqttComponent here instead of declarations
            declarations: [MockHeaderComponent], // Keep only MockHeaderComponent here
            providers: [{ provide: MqttService, useValue: mockMqttService }],
        }).compileComponents();

        fixture = TestBed.createComponent(MqttComponent);
        component = fixture.componentInstance;
    });

    it('should create the component and render without errors', () => {
        expect(component).toBeTruthy();
        fixture.detectChanges(); // Trigger change detection
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled).toBeTruthy(); // Check if the component rendered
    });
});
