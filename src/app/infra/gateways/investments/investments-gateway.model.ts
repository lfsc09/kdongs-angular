export interface Wallet {
	wallet_id: string;
	wallet_currency: string;
	wallet_name: string;
	wallet_last_updated: string;
	wallet_input_balance: number;
	wallet_current_balance: number;
	wallet_profit_in_curncy: number;
	wallet_profit_in_perc: number;
}

export interface SelectedWallets {
	title: string;
	total_currency: string;
	total_input_balance: number;
	total_current_balance: number;
	total_profit_in_curncy: number;
	total_profit_in_perc: number;
}

export interface GetWallets {
	data: Wallet[];
}

export type GetWalletsResponse = GetWallets | null;
