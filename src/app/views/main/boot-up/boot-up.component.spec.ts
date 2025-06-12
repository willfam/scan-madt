import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BootUpComponent } from './boot-up.component';
import { Store } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppState } from '@store/app.state';
import { IBootUp } from '@models';

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

describe('BootUpComponent', () => {
    let component: BootUpComponent;
    let fixture: ComponentFixture<BootUpComponent>;
    let store: Store<any>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, CommonModule, BootUpComponent],
            providers: [{ provide: Store, useClass: MockStore }],
        }).compileComponents();

        store = TestBed.inject(Store);
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(BootUpComponent);
        component = fixture.componentInstance;
    });

    it('should create and render the BootUpComponent', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
        const compiled = fixture.nativeElement;
        expect(compiled).toBeTruthy();
    });

    it('should subscribe to the bootUp$ observable and update bootUpdata', fakeAsync(() => {
        spyOn(store, 'select').and.returnValue(of(mockBootUp));
        fixture.detectChanges();
        tick();

        expect(component.bootUpdata).toEqual(mockBootUp);
    }));

    it('should initialize bootUp$ observable and update bootUpdata on ngOnInit', fakeAsync(() => {
        const bootUpState = { ...mockBootUp };
        spyOn(store, 'select').and.returnValue(of(bootUpState));

        component.ngOnInit();
        tick();

        expect(component.bootUpdata).toEqual(bootUpState);
    }));

    it('should navigate when handleNavigate is called', () => {
        spyOn(router, 'navigate');
        const page = 'home';

        component.handleNavigate(page);

        expect(router.navigate).toHaveBeenCalledWith([page]);
    });

    it('should unsubscribe from the store observable on destroy', () => {
        spyOn(component['destroy$'], 'next');
        spyOn(component['destroy$'], 'complete');

        component.ngOnDestroy();

        expect(component['destroy$'].next).toHaveBeenCalled();
        expect(component['destroy$'].complete).toHaveBeenCalled();
    });
});
