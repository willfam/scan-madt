import { Component, Output, EventEmitter, Input } from '@angular/core';
import { StrNum } from '@models';

@Component({
    selector: 'app-custom-radio-button',
    standalone: true,
    imports: [],
    templateUrl: './custom-radio-button.component.html',
    styleUrl: './custom-radio-button.component.scss',
})
export class CustomRadioButtonComponent {
    @Output() onSelect = new EventEmitter<StrNum>();
    @Input() value!: StrNum;
    @Input() label!: StrNum;
    @Input() isSelected!: boolean;

    onClickHandler(e: string | number) {
        this.onSelect.emit(e);
    }
}
