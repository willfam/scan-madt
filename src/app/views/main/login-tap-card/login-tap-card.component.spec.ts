import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { LoginTapCardComponent } from './login-tap-card.component';
import { MqttService } from '@services/mqtt.service';

// Mock MqttService
class MockMqttService {
    connectionStatus$ = of(true);
    mqttConfigLoaded$ = of(true);

    mqttConfig = {
        topics: {},
    };

    subscribe = jasmine.createSpy('subscribe');
    publish = jasmine.createSpy('publish');
}

class MockTranslateService {
    currentLang: string = 'EN';
    use(lang: string) {
        this.currentLang = lang;
    }
}

describe('LoginTapCardComponent', () => {
    let component: LoginTapCardComponent;
    let fixture: ComponentFixture<LoginTapCardComponent>;
    let store: Store;
    let mockMqttService: MockMqttService;
    let translateService: MockTranslateService;

    const storeMock = {
        dispatch: jasmine.createSpy('dispatch'),
        select: () => of([]), // Mock the select method if needed
    };

    beforeEach(async () => {
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [CommonModule, LoginTapCardComponent],
            providers: [
                { provide: TranslateService, useClass: MockTranslateService },
                { provide: Store, useValue: storeMock },
                { provide: MqttService, useValue: mockMqttService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginTapCardComponent);
        component = fixture.componentInstance;
        translateService = TestBed.inject(TranslateService);
        // fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
