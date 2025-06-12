import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'calibrate-bls-menu',
    imports: [CommonModule, MatIconModule, RouterModule, ReactiveFormsModule, TranslateModule],
    templateUrl: './calibrate-bls-menu.component.html',
    styleUrls: ['./calibrate-bls-menu.component.scss'],
})
export class CalibrateBLSMenuComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit() {}

    handleNavigate(url: string): void {
        this.router.navigate([url]);
    }
}
