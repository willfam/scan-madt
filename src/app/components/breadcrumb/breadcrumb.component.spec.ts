import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbComponent } from './breadcrumb.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NavigationEnd } from '@angular/router';

describe('BreadcrumbComponent', () => {
    let component: BreadcrumbComponent;
    let fixture: ComponentFixture<BreadcrumbComponent>;
    let mockRouter: any;
    let mockActivatedRoute: any;

    beforeEach(async () => {
        mockRouter = {
            events: of(new NavigationEnd(1, '/test', '/test')),
        };

        mockActivatedRoute = {
            snapshot: {
                data: {
                    breadcrumb: 'Test',
                    rootRoute: '/root',
                },
            },
            firstChild: null,
            routeConfig: {
                path: 'test',
            },
        };

        await TestBed.configureTestingModule({
            imports: [BreadcrumbComponent],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BreadcrumbComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should build breadcrumbs on navigation end', () => {
        component.ngOnInit();
        expect(component.breadcrumbs.length).toBe(1);
        expect(component.breadcrumbs[0]).toEqual({
            label: 'Test',
            link: '/root',
        });
    });

    it('should handle rootRoute correctly', () => {
        mockActivatedRoute.snapshot.data.rootRoute = '/newRoot';
        component.ngOnInit();
        component.buildBreadcrumb(mockActivatedRoute);

        expect(component.breadcrumbs[0].link).toBe('/newRoot');
    });
});
