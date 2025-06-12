import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
type Layout = 'numeric' | 'text';
@Component({
    selector: 'custom-keyboard',
    templateUrl: './custom-keyboard.component.html',
    styleUrls: ['./custom-keyboard.component.scss'],
    standalone: true,
    imports: [NgIf, MatButton, TranslateModule],
})
export class CustomKeyboardComponent {
    @Input() layout?: Layout;
    @Output() onKeyPress: EventEmitter<Event> = new EventEmitter<Event>();

    constructor() {}

    handleChangeInput(event: Event): void {
        const target = <HTMLDivElement>event.target;

        if (['switchKey1', 'switchKey2'].includes(target.id)) {
            this.layout = this.layout === 'numeric' ? 'text' : 'numeric';
            return;
        }

        this.onKeyPress.emit(event);
    }
}
