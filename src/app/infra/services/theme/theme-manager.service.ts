import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ThemeManagerService {

    private _darkTheme = signal<boolean>(false);

    darkTheme = this._darkTheme.asReadonly();

	constructor() {}

    invert() {
        this._darkTheme.update((previous) => !previous);
    }
}
