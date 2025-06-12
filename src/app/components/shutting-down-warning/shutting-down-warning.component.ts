import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { Subject } from 'rxjs';

@Component({
    selector: 'shutting-down-warning',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './shutting-down-warning.component.html',
    styleUrl: './shutting-down-warning.component.scss',
})
export class ShuttingDownWarningComponent implements OnDestroy, OnInit {
    private destroy$ = new Subject<void>();
    @Input() time?: string = '';
    @Input() disabled?: boolean = false;
    @Output() onConfirm: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private router: Router,
        private store: Store<AppState>,
    ) {}

    ngOnInit() {
        // const audio = new Audio();
        // audio.src = '../../assets/audios/AUD2.wav';
        // audio.load();
        // audio.play();
    }

    handleClick() {
        this.onConfirm.emit();
    }

    ngOnDestroy() {
        // Emit to destroy all active subscriptions
        this.destroy$.next();
        this.destroy$.complete();
    }
}
