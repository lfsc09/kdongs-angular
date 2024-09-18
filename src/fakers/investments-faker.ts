import { GetWalletsResponse } from '../app/infra/gateways/my-investments/my-investments-gateway.model';

interface Wallet {
	wallet_id: string;
	wallet_currency: string;
	wallet_name: string;
	wallet_last_updated: string;
	wallet_input_balance: number;
	wallet_current_balance: number;
	wallet_profit_in_curncy: number;
	wallet_profit_in_perc: number;
}

interface SelectedWallets {
	title: string;
	total_currency: string;
	total_input_balance: number;
	total_current_balance: number;
	total_profit_in_curncy: number;
	total_profit_in_perc: number;
}

export class InvestmentsFaker {
	private static selectedWallets: SelectedWallets = {
		title: 'All Wallets',
		total_currency: 'BRL',
		total_input_balance: 310000,
		total_current_balance: 357000,
		total_profit_in_curncy: 357000 - 310000,
		total_profit_in_perc: (357000 - 310000) / 310000,
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
}
