import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { AsyncPipe, CurrencyPipe, DatePipe, LowerCasePipe, PercentPipe } from '@angular/common';
import { Component, InjectionToken, OnDestroy, OnInit, Signal, computed, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
	faBrazilianRealSign,
	faCaretDown,
	faChartBar,
	faCheck,
	faCircleInfo,
	faDollarSign,
	faEuroSign,
	faFileInvoiceDollar,
	faPlus,
	faRotate,
	faTimeline,
	faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { KdsLoadingSpinnerComponent } from '../../../../components/shared/kds/kds-loading-spinner/kds-loading-spinner.component';
import { Currency, GetInvestmentsPerformanceRequest, IInvestmentsGatewayService, PerformanceData, Wallet } from '../../../../infra/gateways/investments/investments-gateway.model';
import { Section, SelectableCurrency, SelectableWallets, SelectableWalletsMap_Key, SelectableWalletsMap_Value, UserPreferences } from './investments-dash.model';
import { PerformanceEvolutionComponent } from './performance-evolution/performance-evolution.component';
import { PerformanceGroupComponent } from './performance-group/performance-group.component';
import { PerformanceIndicatorsComponent } from './performance-indicators/performance-indicators.component';

const tokenIInvestmentsGatewayService = new InjectionToken<IInvestmentsGatewayService>('IInvestmentsGatewayService');

@Component({
	selector: 'app-investments-dash',
	standalone: true,
	imports: [
		FontAwesomeModule,
		AsyncPipe,
		CurrencyPipe,
		PercentPipe,
		DatePipe,
		LowerCasePipe,
		KdsLoadingSpinnerComponent,
		CdkMenuTrigger,
		CdkMenu,
		CdkMenuItem,
		PerformanceIndicatorsComponent,
		PerformanceEvolutionComponent,
		PerformanceGroupComponent,
	],
	providers: [
		{
			provide: tokenIInvestmentsGatewayService,
			useClass: environment.investmentsGatewayService,
		},
	],
	templateUrl: './investments-dash.component.html',
})
export class InvestmentsDashComponent implements OnInit, OnDestroy {
	/**
	 * SERVICES
	 */
	private readonly investmentsGatewayService = inject(tokenIInvestmentsGatewayService);

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
		faCircleInfo: faCircleInfo,
		faDollarSign: faDollarSign,
		faBrazilianRealSign: faBrazilianRealSign,
		faEuroSign: faEuroSign,
		faWallet: faWallet,
	});
	protected selectedSection = signal<Section | null>(null);
	protected selectedWallets = signal<SelectableWallets>(new Map<SelectableWalletsMap_Key, SelectableWalletsMap_Value>());
	protected selectedCurrency = signal<SelectableCurrency | null>(null);
	protected currencyOnUse = computed<Currency>(() => {
		if (this.selectedCurrency() === null || this.selectedWallets().size === 0) return 'BRL';
		else if (this.selectedCurrency() === 'Wallet') {
			let moreFrequentCurrency: { [key: string]: number } = {};
			this.selectedWallets().forEach((sWValue) => {
				if (!(sWValue!.currency in moreFrequentCurrency)) moreFrequentCurrency[sWValue!.currency] = 0;
				moreFrequentCurrency[sWValue!.currency] += 1;
			});
			return Object.entries(moreFrequentCurrency).reduce((highest, curr) => (curr[1] > highest[1] ? curr : highest))[0] as Currency;
		}
		return this.selectedCurrency() as Currency;
	});
	protected gatewayLoading: Signal<boolean> = this.investmentsGatewayService.loading;
	private investmentsSubscription: Subscription | undefined;
	private _wallets = signal<Wallet[] | null>([]);
	protected wallets = this._wallets.asReadonly();
	private _performanceData = signal<PerformanceData | null>({} as PerformanceData);
	protected performanceData = this._performanceData.asReadonly();

	ngOnInit(): void {
		this.readUserPreferences();
		if (this.selectedSection() === 'performance') {
			this.pullPerformanceData({
				wallets: Array.from(this.selectedWallets().keys()),
				wallets_info: true,
			});
		}
	}

	ngOnDestroy(): void {
		this.investmentsSubscription?.unsubscribe();
	}

	/**
	 * FUNCTIONS
	 */
	/**
	 * Setup user selectables like, which wallets and the currency to show.
	 */
	private readUserPreferences(): void {
		const preferences = localStorage.getItem('investments-preferences');

		if (preferences) {
			const parsedPreferences: UserPreferences = JSON.parse(preferences);
			this.handleUpdateSelectedWallets(parsedPreferences.selected_wallets);
			this.selectedCurrency.set(parsedPreferences.currency_to_show);
			this.selectedSection.set(parsedPreferences.section_to_show);
		} else {
			this.handleUpdateSelectedWallets([]);
			this.selectedCurrency.set('Wallet');
			this.selectedSection.set('performance');
		}
		this.writeUserPreferences();
	}

	private writeUserPreferences(): void {
		localStorage.setItem(
			'investments-preferences',
			JSON.stringify({
				selected_wallets: [...this.selectedWallets().keys()],
				currency_to_show: this.selectedCurrency(),
				section_to_show: this.selectedSection(),
			} as UserPreferences),
		);
	}

	protected handleDetailPanelChange(section: Section): void {
		this.selectedSection.set(section);
		this.writeUserPreferences();
		if (section === 'performance') this.pullPerformanceData({ wallets: Array.from(this.selectedWallets().keys()) });
	}

	protected handleCurrencyChange(currency: SelectableCurrency): void {
		this.selectedCurrency.set(currency);
	}

	/**
	 * Update the in memory Map of the selected wallets.
	 * This Map will have the wallet_id as the key `SelectableWalletsMap_Key`, and an object as value `SelectableWalletsMap_Value`.
	 * This object will also have the calculation of percentages for each selected wallet, if wallets data are available.
	 *
	 * If only 1 wallet is selected, it will hold the percentage of this wallet against the sum of all the user wallets.
	 * If multiple wallets are selected, it will hold the percentage of the wallet against the sum of all the selected wallets.
	 */
	private handleUpdateSelectedWallets(selectedWalletsIds: string[]): void {
		if (this.wallets() === null || selectedWalletsIds.length === 0) {
			this.selectedWallets.set(new Map<SelectableWalletsMap_Key, SelectableWalletsMap_Value>());
			return;
		}

		let selectedWalletMap = new Map<SelectableWalletsMap_Key, SelectableWalletsMap_Value>();
		// Calculate the percentages of `input_balance` and `profit` for the selected wallets
		if (this.wallets()!.length > 0) {
			let input_balance_sum = 0;
			let profit_sum = 0;
			if (selectedWalletsIds.length === 1) {
				this.wallets()!.forEach((wallet) => {
					input_balance_sum += wallet.wallet_input_balance;
					profit_sum += wallet.wallet_profit_in_curncy;
				});
			} else {
				this.wallets()!
					.filter((w) => selectedWalletsIds.includes(w.wallet_id))
					.forEach((wallet) => {
						input_balance_sum += wallet.wallet_input_balance;
						profit_sum += wallet.wallet_profit_in_curncy;
					});
			}
			for (let selectedWalletId of selectedWalletsIds) {
				const wallet_idx = this.wallets()!.findIndex((wallet) => wallet.wallet_id === selectedWalletId);
				selectedWalletMap.set(selectedWalletId, {
					input_balance_percentage_of: ((this.wallets()![wallet_idx].wallet_input_balance / input_balance_sum) * 100).toFixed(2).concat('%'),
					profit_percentage_of: ((this.wallets()![wallet_idx].wallet_profit_in_curncy / profit_sum) * 100).toFixed(2).concat('%'),
					currency: this.wallets()![wallet_idx].wallet_currency,
				});
			}
		}
		// At initial load, will not have wallets data to calculate percentages
		else {
			for (let selectedWalletId of selectedWalletsIds) selectedWalletMap.set(selectedWalletId, null);
		}
		this.selectedWallets.set(selectedWalletMap);
	}

	protected handleSelectMoreWallets(event: MouseEvent, selectedWalletId: string): void {
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
		if (this.selectedSection() === 'performance') this.pullPerformanceData({ wallets: Array.from(this.selectedWallets().keys()) });
	}

	private pullPerformanceData(request: GetInvestmentsPerformanceRequest): void {
		this.investmentsSubscription = this.investmentsGatewayService.getInvestmentsPerformance(request).subscribe({
			next: (response) => {
				if (response?.performance === undefined || response?.selected_wallets === undefined) console.error('Data integrity error on Performance Section');
				if (response?.wallets) this._wallets.set(response.wallets);
				this._performanceData.set(response!.performance);
				// If available force update data on the selected wallets
				this.handleUpdateSelectedWallets(response!.selected_wallets);
				this.writeUserPreferences();
			},
			error: (error: Error) => {
				console.error(error.message);
				this._performanceData.set(null);
			},
		});
	}
}
