import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EndShiftComponent } from './end-shift.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

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

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('EndShiftComponent', () => {
    let component: EndShiftComponent;
    let fixture: ComponentFixture<EndShiftComponent>;
    let mockMqttService: MockMqttService;
    let router: Router;

    beforeEach(async () => {
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                EndShiftComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ], // Import the standalone component
            providers: [{ provide: MqttService, useValue: mockMqttService }],
        }).compileComponents();

        fixture = TestBed.createComponent(EndShiftComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    // it('should initialize step as 1', () => {
    //     expect(component.step).toBe(1);
    // });

    // it('should change step to 2 on confirm end shift', () => {
    //     component.handleConfirmEndShift(true);
    //     expect(component.step).toBe(2);
    // });

    // it('should navigate back to /bus-operation on cancel confirm end shift', () => {
    //     const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    //     component.handleConfirmEndShift(false);
    //     expect(navigateSpy).toHaveBeenCalledWith(['/bus-operation']);
    // });

    // it('should go back to step 1 on odometer close', () => {
    //     component.handleCloseOdometer();
    //     expect(component.step).toBe(1);
    // });

    // it('should change step based on goBack input', () => {
    //     component.goBack(3);
    //     expect(component.step).toBe(3);
    // });

    // it('should log the odometer value and navigate to /bus-operation on confirm odometer', () => {
    //     const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    //     component.handleConfirmOdometer('12345');
    //     expect(navigateSpy).toHaveBeenCalledWith(['/bus-operation']);
    // });
});
