// src/app/views/maintenance/fare/fare-console/time-setting/time-setting.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSettingComponent } from './time-setting.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

// Mock Store
class MockStore {
    select = jasmine.createSpy().and.returnValue(of({})); // Mocking select method to return an empty object
    dispatch = jasmine.createSpy(); // Mocking dispatch if needed in the future
}
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

class MockRouter {
    navigate(commands: any[]) {
        return Promise.resolve(true); // Simulate successful navigation
    }
}

describe('TimeSettingComponent', () => {
    let component: TimeSettingComponent;
    let fixture: ComponentFixture<TimeSettingComponent>;
    let router: Router;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                MatIconModule,
                TimeSettingComponent, // Include the component here in imports
            ],
            providers: [
                { provide: Store, useClass: MockStore },
                { provide: Router, useClass: MockRouter }, // Use the mock router
                { provide: MqttService, useValue: mockMqttService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TimeSettingComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should navigate back when handleFinish is called and input is valid', () => {
    //     spyOn(router, 'navigate');

    //     // Simulate valid input
    //     // component.inputValue = '123456'; // A valid input
    //     // component.success = true; // Simulate that the validation passed
    //     component.submitTime('123456');
    //     expect(router.navigate).toHaveBeenCalledWith(['/maintenance/fare/fare-console']);
    // });
});
