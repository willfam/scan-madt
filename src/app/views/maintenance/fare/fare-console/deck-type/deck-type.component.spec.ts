import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DeckTypeComponent } from './deck-type.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Store } from '@ngrx/store'; // Ensure you import the Store from @ngrx/store
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

// Mock Store
class MockStore {
    select = jasmine.createSpy('select').and.returnValue(of({})); // Mock the select method
    dispatch = jasmine.createSpy('dispatch'); // Mock the dispatch method
}

class RouterMock {
    navigate = jasmine.createSpy('navigate');
}

describe('DeckTypeComponent', () => {
    let component: DeckTypeComponent;
    let fixture: ComponentFixture<DeckTypeComponent>;
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
                DeckTypeComponent,
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

        fixture = TestBed.createComponent(DeckTypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    // it('should initialize with correct default values', () => {
    //     expect(component.step).toBe(1);
    //     expect(component.deckType).toBe('');
    // });

    // it('should navigate back when goBack is called', () => {
    //     component.goBack();
    //     expect(router.navigate).toHaveBeenCalledWith(['/maintenance/fare/fare-console']);
    // });

    // it('should reset deckType and step when handleCloseDeckType is called', () => {
    //     component.deckType = 'someDeckType';
    //     component.handleCloseDeckType();
    //     expect(component.deckType).toBe('');
    //     expect(component.step).toBe(1);
    // });

    // it('should change deckType when handleChangeDeckType is called', () => {
    //     const newDeckType = 'newDeckType';
    //     component.handleChangeDeckType(newDeckType);
    //     expect(component.deckType).toBe(newDeckType);
    // });

    // it('should move to step 2 when handleConfirmDeckType is called with a deckType', () => {
    //     spyOn(component, 'goBack');
    //     component.deckType = 'someDeckType';
    //     component.handleConfirmDeckType();
    //     expect(component.goBack).toHaveBeenCalled();
    // });

    // it('should not change step when handleConfirmDeckType is called without a deckType', () => {
    //     component.deckType = '';
    //     component.handleConfirmDeckType();
    //     expect(component.step).toBe(1);
    // });

    // it('should call goBack when handleFinish is called', () => {
    //     spyOn(component, 'goBack');
    //     component.handleFinish();
    //     expect(component.goBack).toHaveBeenCalled();
    // });
});
