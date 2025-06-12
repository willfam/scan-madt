import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BLSInformationComponent } from './bls-information.component';
import { CommonModule } from '@angular/common';
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

describe('BLSInformationComponent', () => {
    let component: BLSInformationComponent;
    let fixture: ComponentFixture<BLSInformationComponent>;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatIconModule,
                RouterModule,
                NgScrollbarModule,
                BLSInformationComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
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

        fixture = TestBed.createComponent(BLSInformationComponent);
        component = fixture.componentInstance;
        // fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize sort object with asc values', () => {
        expect(component.sort).toEqual({ name: 'asc', status: 'asc' });
    });

    it('should toggle the sort direction for name', () => {
        component.handleSort('name');
        expect(component.sort.name).toBe('desc');

        component.handleSort('name');
        expect(component.sort.name).toBe('asc');
    });

    it('should toggle the sort direction for status', () => {
        component.handleSort('status');
        expect(component.sort.status).toBe('desc');

        component.handleSort('status');
        expect(component.sort.status).toBe('asc');
    });
});
