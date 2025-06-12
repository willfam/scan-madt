import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RedeemComponent } from './redeem.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { routerUrls } from '@app/app.routes';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('RedeemComponent', () => {
    let component: RedeemComponent;
    let fixture: ComponentFixture<RedeemComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                RedeemComponent, // Add RedeemComponent to the imports array
                RouterTestingModule, // Use RouterTestingModule to provide the router
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(RedeemComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to /main on handleRedeem with true', () => {
        spyOn(router, 'navigate');
        component.handleRedeem(true);
        expect(router.navigate).toHaveBeenCalledWith([routerUrls?.private?.main?.busStopInformation]);
    });

    it('should navigate to /main on handleRedeem with false', () => {
        spyOn(router, 'navigate');
        component.handleRedeem(false);
        expect(router.navigate).toHaveBeenCalledWith([routerUrls?.private?.main?.busStopInformation]);
    });
});
