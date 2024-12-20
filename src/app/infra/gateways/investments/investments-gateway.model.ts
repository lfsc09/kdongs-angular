import { Signal } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * GATEWAY DEFINITION
 */
export interface IInvestmentsGatewayService {
	loading: Signal<boolean>;
	getInvestmentsPerformance(request: GetInvestmentsPerformanceRequest): Observable<GetInvestmentsPerformanceResponse>;
	getInvestmentsBalanceHistory(request: GetInvestmentsBalanceHistoryRequest): Observable<GetInvestmentsBalanceHistoryResponse>;
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
	local_date_begin: string;
	local_date_end: string;
	avg_days_by_asset: number;
	number_of_assets_total: number;
	number_of_assets_total_positive: number;
	number_of_assets_total_negative: number;
	number_of_assets_active: number;
	number_of_assets_active_positive: number;
	number_of_assets_active_negative: number;
	expectancy_by_asset: number;
	expectancy_by_day: number;
	expectancy_by_month: number;
	expectancy_by_quarter: number;
	expectancy_by_year: number;
	historic_low: number;
	historic_high: number;
	avg_cost_by_asset: number;
	avg_cost_by_day: number;
	avg_cost_by_month: number;
	avg_cost_by_quarter: number;
	avg_cost_by_year: number;
	avg_tax_by_asset: number;
	avg_tax_by_day: number;
	avg_tax_by_month: number;
	avg_tax_by_quarter: number;
	avg_tax_by_year: number;
	breakeven: number;
	edge: number;
	total_profit: number;
	avg_profit: number;
	highest_profit: number;
	total_loss: number;
	avg_loss: number;
	highest_loss: number;
}
export interface PerformanceIndicatorsTotal {
	profit_in_curncy: number;
	profit_in_perc: number;
	avg_days_by_asset: number;
	expectancy_by_asset: number;
	expectancy_by_day: number;
	expectancy_by_month: number;
	expectancy_by_quarter: number;
	expectancy_by_year: number;
	avg_cost_by_asset: number;
	avg_cost_by_day: number;
	avg_cost_by_month: number;
	avg_cost_by_quarter: number;
	avg_cost_by_year: number;
	avg_tax_by_asset: number;
	avg_tax_by_day: number;
	avg_tax_by_month: number;
	avg_tax_by_quarter: number;
	avg_tax_by_year: number;
	total_profit: number;
	avg_profit: number;
	total_loss: number;
	avg_loss: number;
}
export interface PerformanceWalletSeries {
	name: string;
	series: PerformanceWalletDataPoint[];
}
export interface PerformanceWalletDataPoint {
	local_exit_date: number;
	input_value: number;
	gross_profit: number;
	net_profit: number;
	days_to_profit: number;
}

/**
 * For Method: @method getInvestmentsBalanceHistory()
 */
export type GetInvestmentsBalanceHistoryRequest = {
	wallets: string[];
	wallets_info?: boolean;
};
export type GetInvestmentsBalanceHistoryResponse = IInvestmentsBalanceHistory | null;

export interface IInvestmentsBalanceHistory {
	wallets?: Wallet[];
	balance_history: BalanceHistoryData;
	selected_wallets: string[];
}

export interface BalanceHistoryData {
	walletsSeries: BalanceHistoryWalletSeries[];
}

export interface BalanceHistoryWalletSeries {
	name: string;
	series: BalanceHistoryWalletDataPoint[];
}
export interface BalanceHistoryWalletDataPoint {
	balance_id: string;
	movement_type: 'deposit' | 'withdraw' | 'asset_result';
	asset_name?: string;
	local_date: number;
	institution: string;
	origin_currency: Currency;
	origin_amount: number;
	origin_exch_gross_rate?: number;
	origin_exch_op_fee?: number;
	origin_exch_vet_rate?: number;
	result_currency: Currency;
	result_amount: number;
	details?: string;
}
