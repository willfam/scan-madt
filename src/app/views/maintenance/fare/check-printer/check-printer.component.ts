import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'maintenance-check-printer',
    imports: [CommonModule, MatIconModule, RouterModule, ReactiveFormsModule, TranslateModule],
    templateUrl: './check-printer.component.html',
    styleUrls: ['./check-printer.component.scss'],
})
export class CheckPrinterComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
