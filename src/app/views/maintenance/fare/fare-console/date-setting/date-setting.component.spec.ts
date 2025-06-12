import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DateSettingComponent } from './date-setting.component'; // Adjust the import path as necessary
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
        topics: {},
    };

    subscribe = jasmine.createSpy('subscribe');
    publish = jasmine.createSpy('publish');
}

class RouterMock {
    navigate = jasmine.createSpy('navigate');
}

describe('DateSettingComponent', () => {
    let component: DateSettingComponent;
    let fixture: ComponentFixture<DateSettingComponent>;
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
                DateSettingComponent,
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

        fixture = TestBed.createComponent(DateSettingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    // it('should initialize with correct default values', () => {
    //     expect(component.currentDate).toBe('25/02/2024');
    //     expect(component.inputValue).toBe('');
    //     expect(component.step).toBe(1);
    //     expect(component.success).toBeTrue();
    // });
});
