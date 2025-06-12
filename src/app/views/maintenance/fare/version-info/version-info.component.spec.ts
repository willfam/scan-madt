import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VersionInfoComponent } from './version-info.component';
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

describe('VersionInfoComponent', () => {
    let component: VersionInfoComponent;
    let fixture: ComponentFixture<VersionInfoComponent>;
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
                VersionInfoComponent, // Import the standalone component here
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
        fixture = TestBed.createComponent(VersionInfoComponent);
        component = fixture.componentInstance;
        // fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have initial sort values as "asc"', () => {
        expect(component.sort.name).toBe('asc');
        expect(component.sort.status).toBe('asc');
    });

    it('should toggle sort order when handleSort is called', () => {
        component.handleSort('name');
        expect(component.sort.name).toBe('desc');

        component.handleSort('name');
        expect(component.sort.name).toBe('asc');
    });

    it('should toggle sort order for status when handleSort is called', () => {
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
