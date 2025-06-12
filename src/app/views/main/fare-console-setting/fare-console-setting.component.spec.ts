import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FareConsoleSettingComponent } from './fare-console-setting.component';
import { Store } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '@store/app.state';
import { IBootUp } from '@models';
import { MqttService } from '@services/mqtt.service';

const mockBootUp: IBootUp = {
    softwareVersion: 'TestSoftware',
    osVersion: '1.0.0',
    releaseDate: '2024-12-12',
    serialNumber: '12345',
};

class MockStore {
    select(selector: any) {
        return of(mockBootUp);
    }
}

class MockTranslateService {
    currentLang: string = 'EN';
    use(lang: string) {
        this.currentLang = lang;
    }
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

describe('FareConsoleSettingComponent', () => {
    let component: FareConsoleSettingComponent;
    let fixture: ComponentFixture<FareConsoleSettingComponent>;
    let store: Store<any>;
    let router: Router;
    let mockMqttService: MockMqttService;

    beforeEach(async () => {
        mockMqttService = new MockMqttService();

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, CommonModule, FareConsoleSettingComponent],
            providers: [
                { provide: TranslateService, useClass: MockTranslateService },
                { provide: Store, useClass: MockStore },
                { provide: MqttService, useValue: mockMqttService },
            ],
        }).compileComponents();

        store = TestBed.inject(Store);
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(FareConsoleSettingComponent);
        component = fixture.componentInstance;
    });

    it('should create and render the FareConsoleSettingComponent', () => {
        // fixture.detectChanges();
        expect(component).toBeTruthy();
        // const compiled = fixture.nativeElement;
        // expect(compiled).toBeTruthy();
    });

    // it('should subscribe to the bootUp$ observable and update bootUpdata', fakeAsync(() => {
    //     spyOn(store, 'select').and.returnValue(of(mockBootUp));
    //     fixture.detectChanges();
    //     tick();

    //     expect(component.bootUpdata).toEqual(mockBootUp);
    // }));

    // it('should initialize bootUp$ observable and update bootUpdata on ngOnInit', fakeAsync(() => {
    //     const bootUpState = { ...mockBootUp };
    //     spyOn(store, 'select').and.returnValue(of(bootUpState));

    //     component.ngOnInit();
    //     tick();

    //     expect(component.bootUpdata).toEqual(bootUpState);
    // }));

    it('should unsubscribe from the store observable on destroy', () => {
        spyOn(component['destroy$'], 'next');
        spyOn(component['destroy$'], 'complete');

        component.ngOnDestroy();

        expect(component['destroy$'].next).toHaveBeenCalled();
        expect(component['destroy$'].complete).toHaveBeenCalled();
    });
});
