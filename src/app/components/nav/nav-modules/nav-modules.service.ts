import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TokenManagerService } from '../../../infra/services/token/token-manager.service';

@Injectable({
	providedIn: 'root',
})
export class NavModulesService {
	/**
	 * SERVICES
	 */
	private readonly tokenManagerService = inject(TokenManagerService);

	/**
	 * SIGNALS
	 */
	private _opened: WritableSignal<boolean> = signal(true);
	opened = this._opened.asReadonly();

	modules = computed(() => []);

	/**
	 * FUNCTIONS
	 */

	handleOpen() {
		if (!this._opened()) this._opened.set(true);
	}
	handleClose() {
		this._opened.set(false);
	}
}
