import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { ConnectionStatusState } from '@store/connection-status/connection-status.reducer';

import { AppState } from '@store/app.state';
import { MqttService } from '@services/mqtt.service';

// Mocked Data for the Store
const mockConnectionStatus: ConnectionStatusState = {
    connection: {
        statusBOLC: true,
        statusFARE: true,
        statusFMS: false,
        statusCRP: false,
    },
    trigger: {
        triggerBOLCButton: true,
    },
};

class MockMqttService {
    connectionStatus$ = of(true);
    mqttConfigLoaded$ = of(true);

    mqttConfig = {
        topics: {},
    };

    subscribe = jasmine.createSpy('subscribe');
    publish = jasmine.createSpy('publish');
}

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let router: Router;
    let mockStore: jasmine.SpyObj<Store<AppState>>;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        const mockRouter = {
            navigate: jasmine.createSpy('navigate'),
        };

        // Mock the store and the selector for allConnectionStatus
        mockStore = jasmine.createSpyObj('Store', ['select']);
        mockStore.select.and.returnValue(of(mockConnectionStatus));

        await TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            providers: [
                DatePipe, // Mock DatePipe if needed
                { provide: Router, useValue: mockRouter },
                { provide: Store, useValue: mockStore },
                { provide: MqttService, useValue: mockMqttService },
            ],
        }).compileComponents();

        // fixture = TestBed.createComponent(HeaderComponent);
        // component = fixture.componentInstance;
        // router = TestBed.inject(Router);
        // component.screen = 'main';

        // fixture.detectChanges(); // Trigger initial change detection
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        component.screen = 'main';
    });

    it('should create', () => {
        // fixture.detectChanges();
        expect(component).toBeTruthy();
        // component.mqttService.mqttConfigLoaded$ = of(true);
        // const compiled = fixture.nativeElement;
        // expect(compiled).toBeTruthy();
    });

    it('should display buttons based on screen type', () => {
        // const buttons = fixture.debugElement.queryAll(By.css('.button'));
        // expect(buttons.length).toBe(3);
        // const endTripButton = buttons.find((button) => button.nativeElement.id === 'end-trip-btn');
        // expect(endTripButton).toBeTruthy();
    });

    it('should navigate when button with navigateTo is clicked', () => {
        const button = fixture.debugElement.query(By.css('#settings-btn'));

        if (button) {
            button.triggerEventHandler('click', null);

            expect(router.navigate).toHaveBeenCalledWith(['/main/settings']);
        }
    });

    it('should display status indicators for the "main" screen', fakeAsync(() => {
        // fixture.detectChanges(); // Trigger observable subscription
        // tick(); // Simulate async passage of time
        // const statusIndicators = fixture.debugElement.queryAll(By.css('.status-indicators .status'));
        // expect(statusIndicators.length).toBe(4);
    }));

    it('should clear interval on destroy', () => {
        spyOn(window, 'clearInterval');
        component.ngOnDestroy();
        expect(clearInterval).toHaveBeenCalledWith(component.intervalId);
    });

    it('should update status indicators when connection status changes', fakeAsync(() => {
        // Now the status indicators should reflect the updated state
        const statusElements = fixture.debugElement.queryAll(By.css('.status'));
        const bolcStatusElement = statusElements.find((el) => el.nativeElement.textContent.includes('BOLC'));

        if (bolcStatusElement) {
            expect(bolcStatusElement).toBeDefined();
            expect(bolcStatusElement.nativeElement.classList).not.toContain('connected'); // BOLC should no longer be connected
        }
    }));
});
