import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

class MockTranslateService {
    currentLang: string = 'EN';
    use(lang: string) {
        this.currentLang = lang;
    }
}

class MockRouter {
    navigate(path: string[]) {
        // mock navigation
    }
}

describe('SettingsComponent', () => {
    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;
    let translateService: MockTranslateService;
    let router: MockRouter;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SettingsComponent], // Use imports instead of declarations
            schemas: [CUSTOM_ELEMENTS_SCHEMA], // Bypass child components
            providers: [
                { provide: TranslateService, useClass: MockTranslateService },
                { provide: Router, useClass: MockRouter },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;
        translateService = TestBed.inject(TranslateService);
        router = TestBed.inject(Router);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        component.ngOnInit();
        expect(component.currentLanguage).toBe('EN');
        expect(component.languageStep).toBe(1);
        expect(component.selectedLanguage).toBeNull();
    });

    it('should not change language on cancel', () => {
        component.selectedLanguage = { id: 'CH', label: '中文' };
        component.onLanguageChange(false);

        expect(component.languageStep).toBe(1);
        expect(component.selectedLanguage).toBeNull();
    });

    it('should handle language change correctly', () => {
        component.handleChangeLanguage('CH');
        expect(component.selectedLanguage).toEqual({ id: 'CH', label: '中文' });
        expect(component.languageStep).toBe(2);
    });

    it('should reset on goBack', () => {
        component.selectedLanguage = { id: 'CH', label: '中文' };
        component.languageStep = 2;
        component.goBack();

        expect(component.step).toBe('');
        expect(component.languageStep).toBe(1);
        expect(component.selectedLanguage).toBeNull();
    });
});
