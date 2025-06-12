import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MqttService } from '@services/mqtt.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Store } from '@ngrx/store'; // Ensure you import the Store from @ngrx/store

// Mock MqttService
class MockMqttService {
    connectionStatus$ = of(true);
    mqttConfigLoaded$ = of(true);

    mqttConfig = {
        topics: {
            mainPage: { response: 'mainPage/response', get: 'mainPage/get' },
            cvIcon: 'cvIcon',
            busDirInfo: { response: 'busDirInfo/response', get: 'busDirInfo/get' }, // Mock busDirInfo topic
        },
    };

    subscribe = jasmine.createSpy('subscribe');
    publish = jasmine.createSpy('publish');
}

// Mock HeaderComponent
@Component({
    selector: 'app-header',
    template: '',
})
class MockHeaderComponent {}

// Define a module for the mock component
@NgModule({
    declarations: [MockHeaderComponent],
    exports: [MockHeaderComponent],
})
class MockHeaderModule {}

// Mock Store
class MockStore {
    select = jasmine.createSpy('select').and.returnValue(of({})); // Mock the select method
    dispatch = jasmine.createSpy('dispatch'); // Mock the dispatch method
}

describe('MainComponent', () => {
    let component: MainComponent;
    let fixture: ComponentFixture<MainComponent>;
    let mockMqttService: MockMqttService;

    beforeEach(() => {
        mockMqttService = new MockMqttService();
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MainComponent, // Use the standalone component directly
                MockHeaderModule, // Import the mock module for HeaderComponent
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: MqttService, useValue: mockMqttService },
                { provide: Store, useClass: MockStore }, // Provide the MockStore
                DatePipe,
                {
                    provide: Router,
                    useValue: {
                        navigate: jasmine.createSpy('navigate'),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MainComponent);
        component = fixture.componentInstance;
    });

    it('should create the component and render without errors', () => {
        expect(component).toBeTruthy();
    });
});
