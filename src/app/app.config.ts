import { registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/pt';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

registerLocaleData(localeBr);

export const appConfig: ApplicationConfig = {
	providers: [provideRouter(routes), { provide: LOCALE_ID, useValue: 'pt' }, provideAnimationsAsync()],
};
