import { CurrencyPipe, DatePipe, LowerCasePipe, PercentPipe } from '@angular/common';
import { Component, effect, inject, signal, untracked } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faChartBar, faCheck, faFileInvoiceDollar, faPlus, faRotate, faTimeline } from '@fortawesome/free-solid-svg-icons';
import { KdsLoadingSpinnerComponent } from '../../../../components/shared/kds/kds-loading-spinner/kds-loading-spinner.component';
import { Wallet } from '../../../../infra/gateways/investments/investments-gateway.model';
import { InvestmentsGatewayService } from '../../../../infra/gateways/investments/investments-gateway.service';
import { Panel, SelectableCurrency, SelectableWallets, SelectableWalletsMap_Key, SelectableWalletsMap_Value, UserPreferences } from './investments-dash.model';
import { PerformanceIndicatorsComponent } from './performance-indicators/performance-indicators.component';

@Component({
	selector: 'app-investments-dash',
	standalone: true,
	imports: [FontAwesomeModule, CurrencyPipe, PercentPipe, DatePipe, LowerCasePipe, KdsLoadingSpinnerComponent, PerformanceIndicatorsComponent],
	providers: [InvestmentsGatewayService],
	templateUrl: './investments-dash.component.html',
})
export class InvestmentsDashComponent {
	/**
	 * SERVICES
	 */
	private readonly investmentsGatewayService = inject(InvestmentsGatewayService);

	/**
	 * SIGNALS
	 */
	protected icons = signal({
		faPlus: faPlus,
		faRotate: faRotate,
		faCheck: faCheck,
		faCaretDown: faCaretDown,
		faChartBar: faChartBar,
		faTimeline: faTimeline,
		faFileInvoiceDollar: faFileInvoiceDollar,
	});
	protected selected_panel = signal<Panel | null>(null);
	protected selected_wallets = signal<SelectableWallets>(new Map<SelectableWalletsMap_Key, SelectableWalletsMap_Value>());
	protected selected_currency = signal<SelectableCurrency | null>(null);
	protected loadingWallets = signal<boolean>(false);
	private _wallets = signal<Wallet[]>([]);
	protected wallets = this._wallets.asReadonly();

	constructor() {
		effect(async () => {
			untracked(() => this.loadingWallets.set(true));
			const response = await this.investmentsGatewayService.getWalletsFake();
			untracked(() => {
				if (response) this._wallets.set(response.data);
				this.loadingWallets.set(false);
				this.readUserPreferences();
			});
		});
	}

	/**
	 * FUNCTIONS
	 */
	handleDetailPanelChange(panel: Panel): void {
		this.selected_panel.set(panel);
		this.writeUserPreferences();
	}

	/**
	 * Setup user selectables like, which wallets and the currency to show.
	 */
	readUserPreferences(): void {
		const preferences = localStorage.getItem('investments-preferences');

		if (preferences) {
			const parsedPreferences: UserPreferences = JSON.parse(preferences);
			this.handleUpdateSelectedWallets(parsedPreferences.selected_wallets);
			this.selected_currency.set(parsedPreferences.currency_to_show);
			this.selected_panel.set(parsedPreferences.panel_to_show);
		} else {
			this.handleUpdateSelectedWallets();
			this.selected_currency.set('WALLET');
			this.selected_panel.set('performance');
		}
		this.writeUserPreferences();
	}

	writeUserPreferences(): void {
		localStorage.setItem(
			'investments-preferences',
			JSON.stringify({
				selected_wallets: [...this.selected_wallets().keys()],
				currency_to_show: this.selected_currency(),
				panel_to_show: this.selected_panel(),
			} as UserPreferences),
		);
	}

	/**
	 * Update the in memory Map of the selected wallets, also the localStorage data.
	 * This Map will have the wallet_id as the key `SelectableWalletsMap_Key`, and an object as value `SelectableWalletsMap_Value`.
	 * This object will have the calculation of percentages for each selected wallet.
	 *
	 * If only 1 wallet is selected, it will hold the percentage of this wallet against the sum of all the user wallets.
	 * If multiple wallets are selected, it will hold the percentage of the wallet against the sum of all the selected wallets.
	 */
	handleUpdateSelectedWallets(selectedWalletsIds: string[] = []): void {
		let confirmedSelectedWalletIds: string[];
		if (selectedWalletsIds.length > 0) {
			// Check if selected wallets still exist in wallets list, unexistent ones will be filtered out
			confirmedSelectedWalletIds = selectedWalletsIds.filter((presumedWalletId) => this.wallets().some((wallet) => wallet.wallet_id === presumedWalletId));
		} else {
			confirmedSelectedWalletIds = this.wallets().length > 0 ? [this.wallets()[0].wallet_id] : [];
		}

		let selectedWalletMap = new Map<SelectableWalletsMap_Key, SelectableWalletsMap_Value>();
		if (confirmedSelectedWalletIds.length > 0) {
			// Calculate the percentages of `input_balance` and `profit` for the selected wallets
			let input_balance_sum = 0;
			let profit_sum = 0;
			if (confirmedSelectedWalletIds.length === 1) {
				this.wallets().forEach((wallet) => {
					input_balance_sum += wallet.wallet_input_balance;
					profit_sum += wallet.wallet_profit_in_curncy;
				});
			} else {
				this.wallets()
					.filter((w) => confirmedSelectedWalletIds.includes(w.wallet_id))
					.forEach((wallet) => {
						input_balance_sum += wallet.wallet_input_balance;
						profit_sum += wallet.wallet_profit_in_curncy;
					});
			}
			for (let confirmedSelectedWalletId of confirmedSelectedWalletIds) {
				const wallet_idx = this.wallets().findIndex((wallet) => wallet.wallet_id === confirmedSelectedWalletId);
				selectedWalletMap.set(confirmedSelectedWalletId, {
					input_balance_percentage_of: ((this.wallets()[wallet_idx].wallet_input_balance / input_balance_sum) * 100).toFixed(2).concat('%'),
					profit_percentage_of: ((this.wallets()[wallet_idx].wallet_profit_in_curncy / profit_sum) * 100).toFixed(2).concat('%'),
				});
			}
		} else {
			console.error('Failed to get the first wallet to select.');
		}
		this.selected_wallets.set(selectedWalletMap);
	}

	handleSelectMoreWallets(event: MouseEvent, selectedWalletId: string): void {
		// Selecting multiple wallets with Ctrl
		if (event.ctrlKey) {
			let selectedWalletIds: string[];
			// Figure it out if must add or remove
			if (this.selected_wallets().has(selectedWalletId)) {
				selectedWalletIds = Array.from(this.selected_wallets().keys()).filter((wallet_id) => wallet_id !== selectedWalletId);
			} else {
				selectedWalletIds = [...Array.from(this.selected_wallets().keys()), selectedWalletId];
			}
			this.handleUpdateSelectedWallets(selectedWalletIds);
		} else this.handleUpdateSelectedWallets([selectedWalletId]);
		this.writeUserPreferences();
	}
}