import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DagwOperationComponent } from './dagw-operation.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { MqttService } from '@services/mqtt.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MsgID } from '@models';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
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
    publishWithMessageFormat = jasmine.createSpy('publishWithMessageFormat');
}

// Mock Store
class MockStore {
    select = jasmine.createSpy().and.returnValue(of({})); // Mock the `select` method, return an empty object or mock state
}

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

describe('DagwOperationComponent', () => {
    let component: DagwOperationComponent;
    let fixture: ComponentFixture<DagwOperationComponent>;
    let mockMqttService: MockMqttService;
    let mockRouter: MockRouter;

    beforeEach(async () => {
        mockMqttService = new MockMqttService();
        mockRouter = new MockRouter();

        const mockDomSanitizer = {
            bypassSecurityTrustResourceUrl: jasmine
                .createSpy('bypassSecurityTrustResourceUrl')
                .and.returnValue('sanitized-url'),
        };

        await TestBed.configureTestingModule({
            imports: [
                DagwOperationComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                RouterTestingModule, // For testing navigation
            ],
            providers: [
                { provide: MqttService, useValue: mockMqttService },
                { provide: Store, useClass: MockStore }, // Provide the MockStore to satisfy the `Store` dependency
                { provide: Router, useValue: mockRouter },
                MatIconRegistry,
                { provide: DomSanitizer, useValue: mockDomSanitizer },
            ],
            schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements
        }).compileComponents();

        fixture = TestBed.createComponent(DagwOperationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to the specified page', () => {
        const page = '/test-page';
        component.handleNavigate(page);
        expect(mockRouter.navigate).toHaveBeenCalledWith([page]);
    });

    it('should change the selected language', () => {
        const lang = 'EN';
        component.handleChangeLanguage(lang);
        expect(component.selectedLanguage).toBe(lang);
    });
    it('should call MQTT publishWithMessageFormat with correct msgID', () => {
        const topics = { mainTab: { get: 'some/topic' } };
        component.topics = topics;

        // Simulate handleCancel
        component.handleCancel();

        // Check that publishWithMessagaeFormat was called with the correct msgID
        expect(mockMqttService.publishWithMessageFormat).toHaveBeenCalledWith({
            topic: topics.mainTab.get,
            msgID: MsgID?.DAGW_OPERATION, // Expect 'DAGW_OPERATION' here
            payload: {
                triggerDAGWButton: false,
            },
        });
    });

    it('should navigate to the correct login URL', () => {
        const expectedUrl = 'main/login'; // Match the actual URL used in your component
        component.handleCancel();
        expect(mockRouter.navigate).toHaveBeenCalledWith([expectedUrl]); // Expect the URL used in the component
    });

    it('should call ngOnDestroy and complete destroy$', () => {
        spyOn(component['destroy$'], 'next');
        spyOn(component['destroy$'], 'complete');

        component.ngOnDestroy();

        expect(component['destroy$'].next).toHaveBeenCalled();
        expect(component['destroy$'].complete).toHaveBeenCalled();
    });
});
