import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MqttService } from '@services/mqtt.service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { LoginManualComponent } from './login-manual.component';

class MockTranslateService {}

class MockMqttService {
    connectionStatus$ = of(true);
    mqttConfigLoaded$ = of(true);

    mqttConfig = {
        topics: {},
    };

    subscribe = jasmine.createSpy('subscribe');
    publish = jasmine.createSpy('publish');
}

describe('LoginManualComponent', () => {
    let component: LoginManualComponent;
    let fixture: ComponentFixture<LoginManualComponent>;
    let mockMqttService: MockMqttService;

    const storeMock = {
        dispatch: jasmine.createSpy('dispatch'),
        select: () => of([]), // Mock the select method if needed
    };

    beforeEach(async () => {
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [CommonModule, LoginManualComponent],
            providers: [
                { provide: TranslateService, useClass: MockTranslateService },
                { provide: MqttService, useValue: mockMqttService },
                { provide: Store, useValue: storeMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginManualComponent);
        component = fixture.componentInstance;
        // fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
