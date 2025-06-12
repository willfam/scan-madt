import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { HeaderComponent } from '@components/layout/header/header.component';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import config from '@assets/config.json';

@Component({
    standalone: true,
    selector: 'app-cjb',
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
    templateUrl: './cjb.component.html',
    styleUrls: ['./cjb.component.scss'],
})
export class CJBComponent implements OnInit {
    safeUrl: SafeResourceUrl;
    url = config.iFrameURL;
    isBroken = false;
    intervalId;
    @ViewChild('myElement') myElementRef!: ElementRef;

    constructor(
        private sanitizer: DomSanitizer,
        private router: Router,
    ) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }

    onIframeLoad(iframe: HTMLIFrameElement) {
        console.log('Iframe loaded - checking content...');
        try {
            // Try to access iframe's document
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (doc) {
                // Real check: if page body is empty or error page
                const bodyContent = doc.body?.innerHTML || '';
                console.log('Body content:', bodyContent.slice(0, 100)); // preview

                if (!bodyContent.trim()) {
                    // Empty body → maybe broken
                    this.isBroken = true;
                } else {
                    this.isBroken = false;
                }
            } else {
                // No document → broken
                this.isBroken = true;
            }
        } catch (err) {
            console.warn('Cross-origin - cannot check iframe content.', err);
            // Cross-origin → cannot access iframe → assume it's fine OR you can fallback to HEAD request
            this.isBroken = false; // or true based on your policy
        }
    }

    onIframeError() {
        console.log('Iframe failed to load');
        this.isBroken = true;
    }

    backToMaintenance() {
        this.router.navigate(['/maintenance']);
    }

    ngOnInit() {}
}
