import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ThemeManagerService {
	/**
	 * SIGNALS
	 */
	private _darkTheme = signal<boolean>(false);
	darkTheme = this._darkTheme.asReadonly();

	constructor() {
		const themeRead = localStorage.getItem(`theme:${environment.host}`) === 'dark';
		this._darkTheme.set(themeRead);
	}

	invert() {
		this._darkTheme.update((previous) => !previous);
		localStorage.setItem(`theme:${environment.host}`, this._darkTheme() ? 'dark' : 'light');
	}

	goDark() {
		this._darkTheme.set(true);
		localStorage.setItem(`theme:${environment.host}`, 'dark');
	}

	goLight() {
		this._darkTheme.set(false);
		localStorage.setItem(`theme:${environment.host}`, 'light');
	}
}
