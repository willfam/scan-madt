import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EndTripComponent } from './end-trip.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { routerUrls } from '@app/app.routes';

import { Store } from '@ngrx/store'; // Ensure you import the Store from @ngrx/store

import { MqttService } from '@services/mqtt.service';

// Mock MqttService
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

class MockStore {
    select = jasmine.createSpy('select').and.returnValue(of({})); // Mock the select method
    dispatch = jasmine.createSpy('dispatch'); // Mock the dispatch method
}

describe('EndTripComponent', () => {
    let component: EndTripComponent;
    let fixture: ComponentFixture<EndTripComponent>;
    let router: Router;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        const routerMock = {
            navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)),
        };
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [EndTripComponent], // Use imports for standalone component
            providers: [
                { provide: Router, useValue: routerMock },
                { provide: MqttService, useValue: mockMqttService },
                { provide: Store, useClass: MockStore },
            ],
            schemas: [NO_ERRORS_SCHEMA], // To ignore unknown components
        }).compileComponents();

        fixture = TestBed.createComponent(EndTripComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with step 1', () => {
        expect(component.step).toBe(1);
    });

    it('should navigate to main on backToMain', () => {
        component.backToMain();
        expect(router.navigate).toHaveBeenCalledWith([routerUrls?.private?.main?.busStopInformation]);
    });

    it('should navigate to bus operation on navigateToBusOperation', () => {
        component.navigateToBusOperation();
        expect(router.navigate).toHaveBeenCalledWith([routerUrls?.private?.main?.busOperation?.url]);
    });

    it('should update step on goBack', () => {
        component.goBack(2);
        expect(component.step).toBe(2);
    });

    it('should handle confirmation correctly', () => {
        component.handleConfirm(true);
        expect(component.step).toBe(2);

        component.handleConfirm(false);
        expect(router.navigate).toHaveBeenCalledWith([routerUrls?.private?.main?.busStopInformation]);
    });

    // it('should handle end trip type selection', () => {
    //     component.handleSelectEndTripType('normal');
    //     expect(component.endTripType).toBe('normal');
    //     // expect(component.step).toBe(3);
    // });

    it('should show update popup for service type', () => {
        component.handleChange('first_bus_stop');
        expect(component.step).toBe(3);
        expect(component.currentValueChange).toBe('first_bus_stop');
    });

    // it('should show update popup for bus stop', () => {
    //     component.handleSelectBusStop('busPark');
    //     const currentValueChange = component.currentValueChange;
    //     if (currentValueChange === 'first_bus_stop') expect(component.selectedFirstBusStop).toBe('busPark');
    //     else if (currentValueChange === 'last_bus_stop') expect(component.selectedLastBusStop).toBe('busPark');
    // });

    it('should close update bus stop', () => {
        component.handleUpdateBusStop();
        expect(component.step).toBe(0);
    });

    it('should handle confirming reason', () => {
        // component.endTripType = 'normal';
        // component.handleConfirmValue();
        // expect(component.step).toBe(4);
        // expect(component.reason).toBe('');
        // component.endTripType = 'special';
        // component.handleConfirmValue();
        // expect(component.step).toBe(5);
        // component.handleConfirmValue();
        // expect(router.navigate).toHaveBeenCalledWith(['/main/bus-operation']);
    });

    // it('should select reason correctly', () => {
    //     component.handleSelectReason('reason1');
    //     expect(component.reason).toBe('reason1');
    // });

    // it('should close reason correctly', () => {
    //     component.handleCloseReason();
    //     expect(component.reason).toBe('');
    //     expect(component.displayReason).toBeFalse();
    // });

    // it('should confirm reason correctly', () => {
    //     component.reason = 'reason1';
    //     component.handleConfirmReason();
    //     expect(component.displayReason).toBeFalse();
    //     expect(router.navigate).toHaveBeenCalledWith(['/bus-operation']);
    // });

    // it('should finish and navigate back to main', () => {
    //     component.handleFinish();
    //     expect(router.navigate).toHaveBeenCalledWith([routerUrls?.private?.main?.busStopInformation]);
    // });
});
