import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DEFAULT_TIMEOUT } from '@models';
import { AudioService } from '@services/audio.service';

@Component({
    selector: 'bus-off-route',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './bus-off-route.component.html',
    styleUrl: './bus-off-route.component.scss',
})
export class BusOffRouteComponent implements OnDestroy, OnInit {
    @Input() disabled?: boolean = false;
    @Input() fullScreen?: boolean = false;
    @Output() onOk: EventEmitter<string> = new EventEmitter<string>();

    intervalId;

    constructor(private audioService: AudioService) {}

    ngOnInit() {
        clearTimeout(this.intervalId);
        this.intervalId = setTimeout(() => {
            this.handleClick();
        }, DEFAULT_TIMEOUT);

        this.audioService.load('../../assets/audios/AUD2.wav');
        this.audioService.play();
    }

    handleClick() {
        this.onOk.emit();
    }

    ngOnDestroy() {
        // Emit to destroy all active subscriptions
        clearTimeout(this.intervalId);
    }
}
