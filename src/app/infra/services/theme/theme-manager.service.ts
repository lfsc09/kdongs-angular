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
}
