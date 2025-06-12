import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewParameterComponent } from './application-upgrade.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
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

describe('ViewParameterComponent', () => {
    let component: ViewParameterComponent;
    let fixture: ComponentFixture<ViewParameterComponent>;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatIconModule,
                RouterModule,
                NgScrollbarModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                ViewParameterComponent, // Import the standalone component here
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
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewParameterComponent);
        component = fixture.componentInstance;
        // fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize sort object with asc values', () => {
        expect(component.sort).toEqual({ fullName: 'asc', version: 'asc', category: 'asc', status: 'asc' });
    });

    it('should toggle the sort direction for name', () => {
        component.handleSort('fullName');
        expect(component.sort.fullName).toBe('desc');

        component.handleSort('fullName');
        expect(component.sort.fullName).toBe('asc');
    });

    it('should toggle the sort direction for version', () => {
        component.handleSort('version');
        expect(component.sort.version).toBe('desc');

        component.handleSort('version');
        expect(component.sort.version).toBe('asc');
    });

    it('should toggle the sort direction for category', () => {
        component.handleSort('category');
        expect(component.sort.category).toBe('desc');

        component.handleSort('category');
        expect(component.sort.category).toBe('asc');
    });

    it('should toggle the sort direction for status', () => {
        component.handleSort('status');
        expect(component.sort.status).toBe('desc');

        component.handleSort('status');
        expect(component.sort.status).toBe('asc');
    });

    // it('should call ngOnInit', () => {
    //     spyOn(component, 'ngOnInit').and.callThrough();
    //     component.ngOnInit();
    //     expect(component.ngOnInit).toHaveBeenCalled();
    // });
});
