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
			breakeven: 0.49,
			edge: 0.51,
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
		walletsSeries: [
			{
				name: 'Renda Fixa (BTG)',
				series: [
					{ date: new Date('2023-02-21').getTime(), gross_profit: 740.5, net_profit: 649.2, days_to_profit: 28 },
					{ date: new Date('2023-05-10').getTime(), gross_profit: 1457.0, net_profit: 1050.14, days_to_profit: 90 },
					{ date: new Date('2023-06-16').getTime(), gross_profit: 647.25, net_profit: 568.67, days_to_profit: 31 },
					{ date: new Date('2023-09-09').getTime(), gross_profit: 2240.0, net_profit: 1870.65, days_to_profit: 87 },
					{ date: new Date('2023-10-04').getTime(), gross_profit: 750.54, net_profit: 640.89, days_to_profit: 32 },
					{ date: new Date('2023-11-24').getTime(), gross_profit: 699.2, net_profit: 617.1, days_to_profit: 32 },
					{ date: new Date('2024-02-14').getTime(), gross_profit: 2566.0, net_profit: 2566.0, days_to_profit: 119 },
				],
			},
			{
				name: 'Renda Variável (Toro)',
				series: [
					{ date: new Date('2023-07-09').getTime(), gross_profit: 521.99, net_profit: 420.08, days_to_profit: 187 },
					{ date: new Date('2023-10-18').getTime(), gross_profit: 4809.6, net_profit: 4809.6, days_to_profit: 5 },
					{ date: new Date('2023-12-07').getTime(), gross_profit: 1470.0, net_profit: 1470.0, days_to_profit: 89 },
					{ date: new Date('2024-02-14').getTime(), gross_profit: 2150.78, net_profit: 1980.0, days_to_profit: 210 },
					{ date: new Date('2024-04-29').getTime(), gross_profit: 3890.74, net_profit: 3890.74, days_to_profit: 39 },
				],
			},
		],
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
		return Math.trunc(Math.random() * 10) > 9.5;
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
