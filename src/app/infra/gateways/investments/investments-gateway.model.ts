import { Signal } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * GATEWAY DEFINITION
 */
export interface IInvestmentsGatewayService {
	loading: Signal<boolean>;
	getInvestmentsPerformance(request: GetInvestmentsPerformanceRequest): Observable<GetInvestmentsPerformanceResponse>;
}

/**
 * BASE TYPES/INTERFACES
 */
export type Currency = 'BRL' | 'USD' | 'EUR';

/**
 * GATEWAY METHODS
 */

/**
 * For Method: @method getInvestmentsPerformance()
 */
export type GetInvestmentsPerformanceRequest = {
	wallets: string[];
	wallets_info?: boolean;
};
export type GetInvestmentsPerformanceResponse = IInvestmentsPerformance | null;

export interface IInvestmentsPerformance {
	wallets?: Wallet[];
	performance: PerformanceData;
	selected_wallets: string[];
}

export interface Wallet {
	wallet_id: string;
	wallet_currency: Currency;
	wallet_name: string;
	wallet_last_updated: string;
	wallet_input_balance: number;
	wallet_current_balance: number;
	wallet_profit_in_curncy: number;
	wallet_profit_in_perc: number;
}

export interface PerformanceData {
	indicators: PerformanceIndicators;
	indicatorsComparison: PerformanceIndicatorsTotal;
	walletsSeries: PerformanceWalletSeries[];
}

export interface PerformanceIndicators {
	profit_in_curncy: number;
	profit_in_perc: number;
	timeframe_begin: string;
	timeframe_end: string;
	number_of_assets_total: number;
	number_of_assets_total_positive: number;
	number_of_assets_total_negative: number;
	number_of_assets_active: number;
	number_of_assets_active_positive: number;
	number_of_assets_active_negative: number;
	expectancy: number;
	historic_low: number;
	historic_high: number;
	avg_cost: number;
	avg_tax: number;
	breakeven: number;
	edge: number;
	avg_profit: number;
	avg_loss: number;
}
export interface PerformanceIndicatorsTotal {
	profit_in_curncy: number;
	profit_in_perc: number;
	expectancy: number;
	avg_cost: number;
	avg_tax: number;
	avg_profit: number;
	avg_loss: number;
}
export interface PerformanceWalletSeries {
	name: string;
	series: PerformanceWalletDataPoint[];
}
export interface PerformanceWalletDataPoint {
	date: number;
	gross_profit: number;
	net_profit: number;
	days_to_profit: number;
}
