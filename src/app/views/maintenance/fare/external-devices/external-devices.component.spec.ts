import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ExternalDevicesComponent } from './external-devices.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('ExternalDevicesComponent', () => {
    let component: ExternalDevicesComponent;
    let fixture: ComponentFixture<ExternalDevicesComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                ExternalDevicesComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ], // Import standalone component
        }).compileComponents();

        fixture = TestBed.createComponent(ExternalDevicesComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize step as 1', () => {
        expect(component.step).toBe(1);
    });

    it('should initialize all device statuses as "loading"', () => {
        component.devices.forEach((device) => {
            expect(device.status).toBe('loading');
        });
    });

    it('should set device statuses to "success" after 2 seconds', (done) => {
        jasmine.clock().install();
        component.ngOnInit();
        jasmine.clock().tick(2000);

        fixture.detectChanges();

        component.devices.forEach((device) => {
            expect(device.status).toBe('success');
        });

        jasmine.clock().uninstall();
        done();
    });

    it('should check if all devices have status "success"', () => {
        component.devices.forEach((device) => (device.status = 'success'));
        expect(component.allDeviceSuccess()).toBeTrue();
    });

    it('should navigate back to /bus-operation', () => {
        const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
        component.backToBusOperation();
        expect(navigateSpy).toHaveBeenCalledWith(['/bus-operation']);
    });

    it('should set step to the given value when goBack is called', () => {
        component.goBack(3);
        expect(component.step).toBe(3);
    });

    it('should clear interval on destroy', () => {
        const clearIntervalSpy = spyOn(window, 'clearInterval');
        component.ngOnDestroy();
        expect(clearIntervalSpy).toHaveBeenCalledWith(component.intervalId);
    });

    it('should log step value on changes', () => {
        component.step = 2;
        component.ngOnChanges();
    });
});
