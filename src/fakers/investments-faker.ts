import { GetPerformanceResponse, GetWalletsResponse, PerformanceData, Wallet } from '../app/infra/gateways/investments/investments-gateway.model';

export class InvestmentsFaker {
	private static selectedWalletsPerformance: PerformanceData = {
		indicators: {
			profit_in_curncy: 15000,
			profit_in_perc: 0.0529,
			timeframe_begin: '2023-02-04',
			timeframe_end: '2024-04-29',
			number_of_assets_total: 10,
			number_of_assets_total_positive: 10,
			number_of_assets_total_negative: 0,
			number_of_assets_active: 4,
            number_of_assets_active_positive: 4,
			number_of_assets_active_negative: 0,
			expectancy: 1028.75,
			historic_low: 0,
			historic_high: 15000,
			avg_cost: 0,
			avg_tax: 182.94,
			breakeven: 0,
			edge: 1,
			avg_profit: 1028.75,
			avg_loss: 0,
		},
		indicatorsComparison: {
			profit_in_curncy: 47000,
			profit_in_perc: 0.2,
			expectancy: 1900,
			avg_cost: 0,
			avg_tax: 264.85,
			avg_profit: 1900,
			avg_loss: 0,
		},
	};

	private static wallets: Wallet[] = [
		{
			wallet_id: '1e670914-f513-4a6f-a97f-f884b8047171',
			wallet_currency: 'BRL',
			wallet_name: 'Renda Fixa (BTG)',
			wallet_last_updated: '2024-09-04T09:05:41',
			wallet_input_balance: 290000,
			wallet_current_balance: 310000,
			wallet_profit_in_curncy: 310000 - 290000,
			wallet_profit_in_perc: (310000 - 290000) / 290000,
		},
		{
			wallet_id: '1e670914-f413-4a6f-a97f-f884b8047171',
			wallet_currency: 'BRL',
			wallet_name: 'Renda Variável (Toro)',
			wallet_last_updated: '2024-05-18T14:19:11',
			wallet_input_balance: 20000,
			wallet_current_balance: 47000,
			wallet_profit_in_curncy: 47000 - 20000,
			wallet_profit_in_perc: (47000 - 20000) / 20000,
		},
	];

	private static requestFakeTime: number = 1300;

	private static fakeFailRequest(): boolean {
		return Math.trunc(Math.random() * 10) > 8;
	}

	static getWallets(): Promise<GetWalletsResponse> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (this.fakeFailRequest()) reject(new Error('Request Failed'));
				else {
					const response: GetWalletsResponse = {
						data: this.wallets,
					};
					resolve(response);
				}
			}, this.requestFakeTime);
		});
	}

	static getPerformance(): Promise<GetPerformanceResponse> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (this.fakeFailRequest()) reject(new Error('Request Failed'));
				else {
					const response: GetPerformanceResponse = {
						data: this.selectedWalletsPerformance,
					};
					resolve(response);
				}
			}, this.requestFakeTime);
		});
	}
}
