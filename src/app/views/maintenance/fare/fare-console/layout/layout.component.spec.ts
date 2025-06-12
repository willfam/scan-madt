import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FareConsoleLayoutComponent } from './layout.component'; // Adjust the import path as necessary

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
class RouterMock {}

describe('FareConsoleLayoutComponent', () => {
    let component: FareConsoleLayoutComponent;
    let fixture: ComponentFixture<FareConsoleLayoutComponent>;
    let router: RouterMock;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        router = new RouterMock();
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [CommonModule, MatIconModule, FareConsoleLayoutComponent],
            providers: [
                { provide: Router, useValue: router },
                { provide: Store, useClass: MockStore },
                { provide: MqttService, useValue: mockMqttService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FareConsoleLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the component successfully', () => {
        expect(component).toBeDefined();
    });
});
