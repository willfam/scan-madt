import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@components/layout/header/header.component';

@Component({
    standalone: true,
    selector: 'cv-operation-menu',
    imports: [CommonModule, MatIconModule, RouterModule, RouterOutlet, HeaderComponent],
    templateUrl: './cv-operation-menu.component.html',
    styleUrls: ['./cv-operation-menu.component.scss'],
})
export class CVOperationMenuComponent implements OnInit {
    urlPrefix = '/fare/cv-operation';
    constructor(private router: Router) {}

    ngOnInit() {}

    goBack() {
        this.router.navigate(['/fare']);
    }

    handleNavigate(url: string) {
        this.router.navigate([this.urlPrefix + url]);
    }
}
