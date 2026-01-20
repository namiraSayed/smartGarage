import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    provideToastr(),
    importProvidersFrom([
      BrowserAnimationsModule,
      TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    })]),
    provideHttpClient(withInterceptors([tokenInterceptor, loadingInterceptor]))
  ]
};
