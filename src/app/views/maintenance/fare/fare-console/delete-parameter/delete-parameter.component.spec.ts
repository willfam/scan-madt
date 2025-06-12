import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DeleteParameterComponent } from './delete-parameter.component'; // Adjust the import path as necessary
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

class RouterMock {
    navigate = jasmine.createSpy('navigate');
}

// Mock Store
class MockStore {
    select = jasmine.createSpy('select').and.returnValue(of({})); // Mock the select method
    dispatch = jasmine.createSpy('dispatch'); // Mock the dispatch method
}

describe('DeleteParameterComponent', () => {
    let component: DeleteParameterComponent;
    let fixture: ComponentFixture<DeleteParameterComponent>;
    let router: RouterMock;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        router = new RouterMock();
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatIconModule,
                DeleteParameterComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
            providers: [
                { provide: Router, useValue: router },
                { provide: Store, useClass: MockStore },
                { provide: MqttService, useValue: mockMqttService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DeleteParameterComponent);
        component = fixture.componentInstance;
        // fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    // it('should initialize with correct default values', () => {
    //     expect(component.step).toBe(1);
    // });

    // it('should navigate back when goBack is called', () => {
    //     component.goBack();
    //     expect(router.navigate).toHaveBeenCalledWith(['/maintenance/fare/fare-console']);
    // });

    // it('should change step to 2 when handleSelectToDelete is called', () => {
    //     component.handleSelectToDelete();
    //     expect(component.step).toBe(2);
    // });

    // it('should change step to 3 when handleDeleteParameter is called with confirmation', () => {
    //     spyOn(component, 'goBack'); // Spy on goBack method
    //     component.handleDeleteParameter(true);
    //     // expect(component.step).toBe(3);
    //     expect(component.goBack).toHaveBeenCalled();
    // });

    // it('should reset step to 1 when handleDeleteParameter is called without confirmation', () => {
    //     spyOn(component, 'goBack'); // Spy on goBack method
    //     component.handleDeleteParameter(false);
    //     // expect(component.step).toBe(1);
    //     expect(component.goBack).toHaveBeenCalled();
    // });

    // it('should call goBack when handleFinish is called', () => {
    //     spyOn(component, 'goBack'); // Spy on goBack method
    //     component.handleFinish();
    //     expect(component.goBack).toHaveBeenCalled();
    // });
});
