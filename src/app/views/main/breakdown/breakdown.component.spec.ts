import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreakdownComponent } from './breakdown.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { routerUrls } from '@app/app.routes';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({}); // Return an empty object or mock translations
    }
}

describe('BreakdownComponent', () => {
    let component: BreakdownComponent;
    let fixture: ComponentFixture<BreakdownComponent>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatIconModule,
                RouterModule,
                ConfirmDialogComponent,
                DialogComponent,
                BreakdownComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
            ],
            providers: [{ provide: Router, useValue: routerSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BreakdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should update step on goBack call', () => {
        component.goBack(2);
        expect(component.step).toBe(2);
    });

    it('should set endTripType and update step on handleConfirm', () => {
        component.handleConfirm(true);
        expect(component.endTripType).toBe('premature');
        expect(component.step).toBe(3);
    });

    it('should navigate to main on handleConfirm when isConfirm is false', () => {
        component.handleConfirm(false);
        expect(routerSpy.navigate).toHaveBeenCalledWith([routerUrls?.private?.main?.busStopInformation]);
    });

    it('should update endTripType and step on handleSelectEndTripType', () => {
        component.handleSelectEndTripType('normal');
        expect(component.endTripType).toBe('normal');
        expect(component.step).toBe(3);
    });

    it('should show update popup on handleChange', () => {
        component.handleChange('first_bus_stop');
        expect(component.step).toBe(4);
        expect(component.currentValueChange).toBe('first_bus_stop');
    });

    it('should handle update value on handleSelectBusStop', () => {
        component.handleSelectBusStop('busPark');
        const currentValueChange = component.currentValueChange;
        if (currentValueChange === 'first_bus_stop') expect(component.selectedFirstBusStop).toBe('busPark');
        else if (currentValueChange === 'last_bus_stop') expect(component.selectedLastBusStop).toBe('busPark');
    });

    it('should close update popup on handleUpdateBusStop', () => {
        component.handleUpdateBusStop();
        expect(component.step).toBe(3);
    });

    it('should show reason on handleConfirmValue if endTripType is not normal', () => {
        component.endTripType = 'normal';
        component.handleConfirmValue();
        expect(component.step).toBe(4);
        // expect(component.reason).toBe('');

        component.endTripType = '';
        component.handleConfirmValue();
        expect(component.step).toBe(5);
    });

    // it('should update reason on handleSelectReason', () => {
    //     component.handleSelectReason('Reason 1');
    //     expect(component.reason).toBe('Reason 1');
    // });

    it('should close reason popup on selectNumOfComplimentaryTicket', () => {
        component.selectNumOfComplimentaryTicket(1);
        expect(component.numOfComplimentaryTickets).toBe(1);
    });

    it('should close reason popup on printComplimentaryTicket', () => {
        component.numOfComplimentaryTickets = 3;
        component.printComplimentaryTicket();
        expect(component.step).toBe(7);
    });

    it('should close reason popup on selectNumOfBreakdownTicket', () => {
        component.selectNumOfBreakdownTicket(1);
        expect(component.numOfBreakdownTickets).toBe(1);
    });

    it('should close reason popup on printBreakdownTicket', () => {
        component.numOfBreakdownTickets = 4;
        component.printBreakdownTicket();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/main/bus-operation']);
    });

    it('should update step on handelControlStarTrip', () => {
        component.handelControlStarTrip();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/main/bus-operation']);
    });
});
