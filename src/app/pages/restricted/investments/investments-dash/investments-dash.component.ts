import { CurrencyPipe, DatePipe, LowerCasePipe, PercentPipe } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faChartBar, faCheck, faFileInvoiceDollar, faPlus, faRotate, faTimeline } from '@fortawesome/free-solid-svg-icons';
import { KdsLoadingSpinnerComponent } from '../../../../components/shared/kds/kds-loading-spinner/kds-loading-spinner.component';
import { Currency, PerformanceData, Wallet } from '../../../../infra/gateways/investments/investments-gateway.model';
import { InvestmentsGatewayService } from '../../../../infra/gateways/investments/investments-gateway.service';
import { Section, SelectableCurrency, SelectableWallets, SelectableWalletsMap_Key, SelectableWalletsMap_Value, UserPreferences } from './investments-dash.model';
import { PerformanceIndicatorsComponent } from './performance-indicators/performance-indicators.component';
import { PerformanceEvolutionComponent } from './performance-evolution/performance-evolution.component';

@Component({
	selector: 'app-investments-dash',
	standalone: true,
	imports: [FontAwesomeModule, CurrencyPipe, PercentPipe, DatePipe, LowerCasePipe, KdsLoadingSpinnerComponent, PerformanceIndicatorsComponent, PerformanceEvolutionComponent],
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
	protected selectedSection = signal<Section | null>(null);
	protected selectedWallets = signal<SelectableWallets>(new Map<SelectableWalletsMap_Key, SelectableWalletsMap_Value>());
	protected selectedCurrency = signal<SelectableCurrency | null>(null);
	protected currencyOnUse = computed<Currency>(() => {
		if (this.selectedCurrency() === null) return 'BRL';
		else if (this.selectedCurrency() === 'WALLET') {
			const selectedWalletIds = Array.from(this.selectedWallets().keys());
			if (this.wallets() === null || selectedWalletIds.length === 0) return 'BRL';
			if (selectedWalletIds.length === 1) {
				for (let wallet of this.wallets()!) {
					if (wallet.wallet_id === selectedWalletIds[0]) return wallet.wallet_currency;
				}
			}
		}
		return this.selectedCurrency() as Currency;
	});
	protected loadingWallets = signal<boolean>(false);
	protected loadingSections = signal<boolean>(false);
	private _wallets = signal<Wallet[] | null>([]);
	protected wallets = this._wallets.asReadonly();
	private _performanceData = signal<PerformanceData | null>({} as PerformanceData);
	protected performanceData = this._performanceData.asReadonly();

	constructor() {
		effect(async () => {
			untracked(() => this.loadingWallets.set(true));
			const responseWallets = await this.investmentsGatewayService.getWalletsFake();
			untracked(() => {
				this._wallets.set(responseWallets ? responseWallets.data : responseWallets);
				this.loadingWallets.set(false);
				this.readUserPreferences();
			});
			if (this.selectedWallets().size > 0) {
				untracked(() => this.loadingSections.set(true));
				if (this.selectedSection() === 'performance') {
					let httpParams = { wallets: Array.from(this.selectedWallets().keys()) };
					const responsePerformance = await this.investmentsGatewayService.getPerformanceFake(httpParams);
					untracked(() => {
						this._performanceData.set(responsePerformance ? responsePerformance.data : responsePerformance);
						this.loadingSections.set(false);
					});
				}
			}
		});
	}

	/**
	 * FUNCTIONS
	 */
	handleDetailPanelChange(section: Section): void {
		this.selectedSection.set(section);
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
			this.selectedCurrency.set(parsedPreferences.currency_to_show);
			this.selectedSection.set(parsedPreferences.section_to_show);
		} else {
			this.handleUpdateSelectedWallets();
			this.selectedCurrency.set('WALLET');
			this.selectedSection.set('performance');
		}
		this.writeUserPreferences();
	}

	writeUserPreferences(): void {
		localStorage.setItem(
			'investments-preferences',
			JSON.stringify({
				selected_wallets: [...this.selectedWallets().keys()],
				currency_to_show: this.selectedCurrency(),
				section_to_show: this.selectedSection(),
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
		if (this.wallets() === null) {
			this.selectedWallets.set(new Map<SelectableWalletsMap_Key, SelectableWalletsMap_Value>());
			return;
		}

		let confirmedSelectedWalletIds: string[];
		if (selectedWalletsIds.length > 0) {
			// Check if selected wallets still exist in wallets list, unexistent ones will be filtered out
			confirmedSelectedWalletIds = selectedWalletsIds.filter((presumedWalletId) => this.wallets()!.some((wallet) => wallet.wallet_id === presumedWalletId));
		} else {
			confirmedSelectedWalletIds = this.wallets()!.length > 0 ? [this.wallets()![0].wallet_id] : [];
		}

		let selectedWalletMap = new Map<SelectableWalletsMap_Key, SelectableWalletsMap_Value>();
		if (confirmedSelectedWalletIds.length > 0) {
			// Calculate the percentages of `input_balance` and `profit` for the selected wallets
			let input_balance_sum = 0;
			let profit_sum = 0;
			if (confirmedSelectedWalletIds.length === 1) {
				this.wallets()!.forEach((wallet) => {
					input_balance_sum += wallet.wallet_input_balance;
					profit_sum += wallet.wallet_profit_in_curncy;
				});
			} else {
				this.wallets()!
					.filter((w) => confirmedSelectedWalletIds.includes(w.wallet_id))
					.forEach((wallet) => {
						input_balance_sum += wallet.wallet_input_balance;
						profit_sum += wallet.wallet_profit_in_curncy;
					});
			}
			for (let confirmedSelectedWalletId of confirmedSelectedWalletIds) {
				const wallet_idx = this.wallets()!.findIndex((wallet) => wallet.wallet_id === confirmedSelectedWalletId);
				selectedWalletMap.set(confirmedSelectedWalletId, {
					input_balance_percentage_of: ((this.wallets()![wallet_idx].wallet_input_balance / input_balance_sum) * 100).toFixed(2).concat('%'),
					profit_percentage_of: ((this.wallets()![wallet_idx].wallet_profit_in_curncy / profit_sum) * 100).toFixed(2).concat('%'),
				});
			}
		} else {
			console.error('Failed to get the first wallet to select.');
		}
		this.selectedWallets.set(selectedWalletMap);
	}

	handleSelectMoreWallets(event: MouseEvent, selectedWalletId: string): void {
		// Selecting multiple wallets with Ctrl
		if (event.ctrlKey) {
			let selectedWalletIds: string[];
			// Figure it out if must add or remove
			if (this.selectedWallets().has(selectedWalletId)) {
				selectedWalletIds = Array.from(this.selectedWallets().keys()).filter((wallet_id) => wallet_id !== selectedWalletId);
			} else {
				selectedWalletIds = [...Array.from(this.selectedWallets().keys()), selectedWalletId];
			}
			this.handleUpdateSelectedWallets(selectedWalletIds);
		} else this.handleUpdateSelectedWallets([selectedWalletId]);
		this.writeUserPreferences();
	}
}
