import { NgIf } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    standalone: true,
    imports: [NgIf, MatButton],
})
export class DialogComponent {
    constructor(private ele: ElementRef) {}
}
