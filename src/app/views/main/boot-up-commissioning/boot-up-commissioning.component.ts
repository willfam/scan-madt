import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommissioningType } from '@models';

@Component({
    selector: 'app-boot-up-commissioning',
    standalone: true,
    imports: [TranslateModule, RouterModule, CommonModule],
    templateUrl: './boot-up-commissioning.component.html',
    styleUrl: './boot-up-commissioning.component.scss',
})
export class BootUpCommissioningComponent {
    pageData!: string;
    commissioningType = CommissioningType;
    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
    ) {}
    ngOnInit() {
        this.pageData = this.activeRoute.snapshot.data['pageType'] || this.commissioningType?.IN_PROGRESS;
    }
}
