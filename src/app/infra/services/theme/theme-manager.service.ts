import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ThemeManagerService {
	/**
	 * SIGNALS
	 */
	private _darkTheme = signal<boolean>(false);
	darkTheme = this._darkTheme.asReadonly();

	invert() {
		this._darkTheme.update((previous) => !previous);
	}

	goDark() {
		this._darkTheme.set(true);
	}

	goLight() {
		this._darkTheme.set(false);
	}
}
