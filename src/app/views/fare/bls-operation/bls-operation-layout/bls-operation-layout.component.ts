import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterOutlet } from '@angular/router';

import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { HeaderComponent } from '@components/layout/header/header.component';

@Component({
    standalone: true,
    selector: 'bls-operation-layout',
    imports: [CommonModule, HeaderComponent, BreadcrumbComponent, MatIconModule, RouterModule, RouterOutlet],
    templateUrl: './bls-operation-layout.component.html',
    styleUrls: ['./bls-operation-layout.component.scss'],
})
export class BLSOperationLayoutComponent {
    constructor() {}
}
