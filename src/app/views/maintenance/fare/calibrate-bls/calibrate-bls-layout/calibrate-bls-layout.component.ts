import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router, RouterOutlet } from '@angular/router';

@Component({
    standalone: true,
    selector: 'calibrate-bls-layout',
    imports: [CommonModule, MatIconModule, RouterModule, RouterOutlet],
    templateUrl: './calibrate-bls-layout.component.html',
    styleUrls: ['./calibrate-bls-layout.component.scss'],
})
export class CalibrateBLSLayoutComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit() {}
}
