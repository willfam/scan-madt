import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionComponent } from './transaction.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
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

describe('TransactionComponent', () => {
    let component: TransactionComponent;
    let fixture: ComponentFixture<TransactionComponent>;
    let router: Router;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                TransactionComponent, // Import the standalone component here
            ],
            providers: [
                { provide: Store, useClass: MockStore }, // Provide MockStore
                { provide: MqttService, useValue: mockMqttService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TransactionComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
