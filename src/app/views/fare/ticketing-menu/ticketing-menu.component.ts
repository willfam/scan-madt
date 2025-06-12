import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from '@components/layout/header/header.component';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';

@Component({
    standalone: true,
    selector: 'app-ticketing-menu',
    imports: [CommonModule, TranslateModule, HeaderComponent, ConfirmDialogComponent],
    templateUrl: './ticketing-menu.component.html',
    styleUrls: ['./ticketing-menu.component.scss'],
})
export class TicketingMenuComponent implements OnInit {
    buttons = [
        {
            title: 'CANCEL_RIDE_CV1',
            icon: '/assets/images/icons/ticketing/cancel1.svg',
            url: '/fare/cancel-ride-cv1',
        },
        {
            title: 'CANCEL_RIDE_CV2',
            icon: '/assets/images/icons/ticketing/cancel2.svg',
            url: '/fare/cancel-ride-cv2',
        },
        {
            title: 'TRANSACTION',
            icon: '/assets/images/icons/ticketing/transaction.svg',
            url: '/fare/transaction',
        },
        {
            title: 'PRINT_CASH_FARE',
            icon: '/assets/images/icons/ticketing/print.svg',
            url: '',
        },
        {
            title: 'CONCESSION_CV1',
            icon: '/assets/images/icons/ticketing/concession1.svg',
            url: '/fare/concession-cv1',
        },
        {
            title: 'CONCESSION_CV2',
            icon: '/assets/images/icons/ticketing/concession2.svg',
            url: '/fare/concession-cv2',
        },
        {
            title: 'TOP_UP',
            icon: '/assets/images/icons/ticketing/top-up.svg',
            url: '/fare/top-up',
        },
        // {
        //     title: 'Redeem Complimentary',
        //     icon: '/assets/images/icons/ticketing/redeem.svg',
        //     url: '/fare/redeem-complimentary',
        // },

        {
            title: 'CV_OPERATIONS',
            icon: '/assets/images/icons/ticketing/cv-operation.svg',
            url: '/fare/cv-operation',
        },
        // {
        //     title: 'BLS_OPERATIONS',
        //     icon: '/assets/images/icons/ticketing/bls-operation.svg',
        //     url: '/fare/bls-operation',
        // },
        {
            title: 'PRINTER_OPERATIONS',
            icon: '/assets/images/icons/ticketing/printer-operation.svg',
            url: '/fare/printer-operation',
        },
    ];

    constructor(private router: Router) {}

    ngOnInit() {
        console.log('Ticketing Works!');
    }

    handleNavigate(url: string): void {
        if (url !== '') this.router.navigate([url]);
    }

    ngAfterViewInit() {
        // document.getElementById('main-status')?.classList?.remove('hidden');
        // document.getElementById('settings-btn')?.classList?.remove('hidden');
        // document.getElementById('lock-btn')?.classList?.remove('hidden');
    }
}
