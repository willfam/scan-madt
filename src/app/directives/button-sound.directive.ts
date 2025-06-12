import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appButtonSound]',
    standalone: true,
})
export class ButtonSoundDirective {
    @HostListener('click', ['$event'])
    public onClick(): void {
        // event.stopPropagation();
        this.playAudio();
    }

    private playAudio(): void {
        const audio = new Audio();
        audio.src = '../../assets/audios/AUD1.wav';
        audio.load();
        audio.play();
    }
}
