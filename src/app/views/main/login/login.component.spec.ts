import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { MqttService } from '@services/mqtt.service';

class MockMqttService {
    connectionStatus$ = of(true);
    mqttConfigLoaded$ = of(true);

    mqttConfig = {
        topics: {},
    };

    subscribe = jasmine.createSpy('subscribe');
    publish = jasmine.createSpy('publish');
}

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let mockMqttService: MockMqttService;

    const mockStore = {
        select: jasmine.createSpy('select').and.returnValue(of('')),
        dispatch: jasmine.createSpy('dispatch'),
    };

    beforeEach(async () => {
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [LoginComponent, TranslateModule.forRoot()],
            providers: [
                { provide: Store, useValue: mockStore },
                { provide: MqttService, useValue: mockMqttService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
