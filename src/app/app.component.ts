import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { LocalStorageService } from '@services/local-storage.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    title = 'lta-madt-gui';

    constructor(private localStorageService: LocalStorageService) {}

    ngOnInit() {
        this.renderTheme();
    }

    private renderTheme(): void {
        const lightModeStr = this.localStorageService.getItem('isLightMode');

        if (lightModeStr) {
            const isLightMode = JSON.parse(lightModeStr);
            const body = document.getElementsByTagName('body')[0];
            body.classList.remove(isLightMode ? 'dark-theme' : 'light-theme');
            body.classList.add(isLightMode ? 'light-theme' : 'dark-theme');
        }
    }
}
