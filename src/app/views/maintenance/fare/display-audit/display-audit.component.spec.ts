import { TestBed } from '@angular/core/testing';
import { DisplayAuditComponent } from './display-audit.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

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

describe('DisplayAuditComponent', () => {
    let component: DisplayAuditComponent;
    let fixture: any;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                DisplayAuditComponent, // Import the standalone component directly
            ],
            providers: [
                { provide: MqttService, useValue: mockMqttService },
                // { provide: Store, useClass: MockStore }, // Provide the MockStore
                // {
                //     provide: Router,
                //     useValue: {
                //         navigate: jasmine.createSpy('navigate'),
                //     },
                // },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DisplayAuditComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
