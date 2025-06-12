import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { updateActiveCVs } from '@app/store/main/main.reducer';
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'front-exit',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatInputModule, MatButtonModule, ReactiveFormsModule, TranslateModule],
    templateUrl: './front-exit.component.html',
    styleUrls: ['./front-exit.component.scss'],
})
export class FrontExitComponent {
    exitMode: string = '';

    constructor(
        private router: Router,
        private activeRouter: ActivatedRoute,
        private store: Store<AppState>,
    ) {}

    // ngOnInit(): void {
    //     const isNewAccess = this.activeRouter.snapshot.params['new'];
    // }

    setExitMode(mode: string): void {
        this.exitMode = mode;
    }

    backToMain(): void {
        this.router.navigate(['/main']);
    }

    goBack(): void {
        this.exitMode = '';
    }

    handleUpdateCV(isExit: boolean | null): void {
        if (isExit) {
            this.store.dispatch(
                updateActiveCVs({ payload: this.exitMode === 'CV1' ? [1] : this.exitMode === 'CV2' ? [2] : [] }),
            );
        }
        this.router.navigate(['/main']);
    }
}
