import { Currency } from '../../../../infra/gateways/investments/investments-gateway.model';

export type Section = 'performance' | 'balance_history' | 'assets';

export type SelectableCurrency = 'Wallet' | Currency;

export type SelectableWalletsMap_Key = string;
export type SelectableWalletsMap_Value = { input_balance_percentage_of: string; profit_percentage_of: string; currency: string } | null;
export type SelectableWallets = Map<SelectableWalletsMap_Key, SelectableWalletsMap_Value>;

export type UserPreferences = {
	selected_wallets: string[];
	currency_to_show: SelectableCurrency;
	section_to_show: Section;
};
