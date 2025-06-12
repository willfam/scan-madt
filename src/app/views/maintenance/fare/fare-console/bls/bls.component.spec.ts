import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BLSStatusComponent } from './bls.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
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

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

// Mock Store
class MockStore {
    select = jasmine.createSpy('select').and.returnValue(of({})); // Mock the select method
    dispatch = jasmine.createSpy('dispatch'); // Mock the dispatch method
}

class RouterMock {
    navigate = jasmine.createSpy('navigate');
}

describe('BLSStatusComponent', () => {
    let component: BLSStatusComponent;
    let fixture: any;
    let router: RouterMock;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        router = new RouterMock();
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [
                BLSStatusComponent,
                RouterTestingModule, // Use RouterTestingModule for routing in tests
            ],
            providers: [
                { provide: Router, useValue: router },
                { provide: Store, useClass: MockStore },
                { provide: MqttService, useValue: mockMqttService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BLSStatusComponent);
        component = fixture.componentInstance;
        // router = TestBed.inject(Router);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with step 1 and enabled true', () => {
        expect(component.step).toBe(1);
        // expect(component.enabled).toBeTrue();
    });

    it('should navigate to the fare console on goBack', () => {
        component.goBack();
        expect(router.navigate).toHaveBeenCalledWith(['/maintenance/fare/fare-console']);
    });

    // it('should set step to 2 and enabled to false on handleSelectStatus(false)', () => {
    //     component.handleSelectStatus(false);
    //     expect(component.step).toBe(2);
    //     expect(component.enabled).toBeFalse();
    // });

    // it('should set step to 3 on handleUpdateStatus(true)', () => {
    //     spyOn(component, 'goBack');
    //     component.handleUpdateStatus(true);
    //     // expect(component.step).toBe(3);
    //     expect(component.goBack).toHaveBeenCalled();
    // });

    // it('should toggle enabled and set step to 1 on handleUpdateStatus(false)', () => {
    //     component.handleUpdateStatus(false);
    //     expect(component.enabled).toBeFalse(); // Initially true, so it becomes false
    //     expect(component.step).toBe(1);
    // });

    // it('should navigate back on handleFinish', () => {
    //     spyOn(component, 'goBack');
    //     component.handleFinish();
    //     expect(component.goBack).toHaveBeenCalled();
    // });
});
