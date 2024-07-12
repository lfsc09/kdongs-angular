import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TokenManagerService } from '../../../../infra/services/token/token-manager.service';

@Injectable({
	providedIn: 'root',
})
export class NavLeftService {
	/**
	 * SERVICES
	 */
	private readonly tokenManagerService = inject(TokenManagerService);

	/**
	 * SIGNALS
	 */
	private _opened: WritableSignal<boolean> = signal(true);
	opened = this._opened.asReadonly();

	modules = computed(() => [
        
    ]);

    /**
     * FUNCTIONS
     */

	handleOpened() {
		this._opened.update((previous) => !previous);
	}
}
