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
	modules = computed(() =>
		[
			{
				title: 'Home',
				icon: 'faHouse',
				url: '/r!/home',
			},
			this.tokenManagerService.tokenData()?.perms['USERS_ACCESS'] ?? false
				? {
						title: 'Manage Users',
						icon: 'faUsersGear',
						url: '/r!/users',
					}
				: null,
			this.tokenManagerService.tokenData()?.perms['INVESTMENTS_ACCESS'] ?? false
				? {
						title: 'My Investments',
						icon: 'faChartPie',
						url: '/r!/investments',
					}
				: null,
			this.tokenManagerService.tokenData()?.perms['EXPENSES_ACCESS'] ?? false
				? {
						title: 'My Expenses',
						icon: 'faCreditCard',
						url: '/r!/expenses',
					}
				: null,
			this.tokenManagerService.tokenData()?.perms['STOCKS_ANALYSE_ACCESS'] ?? false
				? {
						title: 'Stocks Studies',
						icon: 'faMagnifyingGlassChart',
						url: '/r!/stocks-analyse',
					}
				: null,
		].filter((v) => !!v),
	);

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
