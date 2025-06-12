import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'redetect-fms',
    imports: [CommonModule, MatIconModule, RouterModule, ReactiveFormsModule, TranslateModule],
    templateUrl: './redetect-fms.component.html',
    styleUrls: ['./redetect-fms.component.scss'],
})
export class RedetectFMSComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
