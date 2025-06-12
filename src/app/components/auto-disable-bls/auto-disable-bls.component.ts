import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AudioService } from '@services/audio.service';

@Component({
    selector: 'auto-disable-bls',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './auto-disable-bls.component.html',
    styleUrl: './auto-disable-bls.component.scss',
})
export class AutoDisableBlsComponent implements OnDestroy, OnInit {
    @Input() disabled?: boolean = false;
    @Input() fullScreen?: boolean = false;
    @Output() onOk: EventEmitter<string> = new EventEmitter<string>();
    @Output() onCancel: EventEmitter<string> = new EventEmitter<string>();

    constructor(private audioService: AudioService) {}

    ngOnInit() {
        this.audioService.load('../../assets/audios/AUD2.wav');
        this.audioService.play();
    }

    handleConfirm() {
        this.onOk.emit();
    }

    handleCancel() {
        this.onCancel.emit();
    }

    ngOnDestroy() {
        // Emit to destroy all active subscriptions
    }
}
