import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from '@components/layout/header/header.component';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { SideNavMenu, maintenanceFareMenu } from '@data/side-nav';

@Component({
    standalone: true,
    selector: 'maintenance-fare-layout',
    imports: [
        CommonModule,
        MatIconModule,
        NgScrollbarModule,
        RouterModule,
        RouterOutlet,
        TranslateModule,
        BreadcrumbComponent,
        HeaderComponent,
    ],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
})
export class FareLayoutComponent implements OnInit {
    menus: SideNavMenu[] = maintenanceFareMenu;
    activeMenu: SideNavMenu | null = null;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this.router.events.subscribe((ev) => {
            if (ev instanceof NavigationEnd) {
                this.checkActiveMenu(this.activatedRoute);
            }
        });
    }

    ngOnInit() {
        this.checkActiveMenu(this.activatedRoute);
    }

    handleActiveMenu(menu: SideNavMenu): void {
        this.activeMenu = menu;
    }

    checkActiveMenu(activeRoute: ActivatedRoute): void {
        const currentUrl = activeRoute['_routerState']['snapshot']['url'] || '';
        this.menus.forEach((m: SideNavMenu) => {
            if (currentUrl === '/maintenance/fare') {
                this.activeMenu = this.menus[0];
            }

            if (currentUrl.includes(`/maintenance/fare${m.route}`)) {
                this.activeMenu = m;
            }
        });
    }
}
