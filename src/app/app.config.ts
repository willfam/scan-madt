import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { appStore } from './store/app.state';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(HttpClientModule),
        importProvidersFrom(
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient],
                },
            }),
        ),
        provideRouter(routes),
        provideClientHydration(),
        provideAnimationsAsync(),
        provideStore(appStore),
    ],
};
