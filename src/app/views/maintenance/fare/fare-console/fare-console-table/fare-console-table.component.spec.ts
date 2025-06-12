import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FareConsoleTableComponent } from './fare-console-table.component'; // Adjust the import path as necessary
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

// Mock Store
class MockStore {
    select = jasmine.createSpy('select').and.returnValue(of({})); // Mock the select method
    dispatch = jasmine.createSpy('dispatch'); // Mock the dispatch method
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

describe('FareConsoleTableComponent', () => {
    let component: FareConsoleTableComponent;
    let fixture: ComponentFixture<FareConsoleTableComponent>;
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
                FareConsoleTableComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
            providers: [
                { provide: Router, useValue: router },
                { provide: MqttService, useValue: mockMqttService },
                { provide: Store, useClass: MockStore }, // Provide the MockStore
                // {
                //     provide: Router,
                //     useValue: {
                //         navigate: jasmine.createSpy('navigate'),
                //     },
                // },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FareConsoleTableComponent);
        component = fixture.componentInstance;
        // fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
        expect(component.urlPrefix).toBe('/maintenance/fare/fare-console');
    });

    it('should navigate to the correct URL when handleNavigate is called', () => {
        const url = component.urlPrefix;
        component.handleNavigate('/deck-type');
        expect(router.navigate).toHaveBeenCalledWith([url + '/deck-type']);
    });
});
