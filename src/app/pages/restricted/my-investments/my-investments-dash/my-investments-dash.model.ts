export type Panel = 'performance' | 'balance_history' | 'assets';

export type SelectableCurrency = 'WALLET' | 'BRL' | 'USD' | 'EUR';

export type SelectableWalletsMap_Key = string;
export type SelectableWalletsMap_Value = { input_balance_percentage_of: string; profit_percentage_of: string };
export type SelectableWallets = Map<SelectableWalletsMap_Key, SelectableWalletsMap_Value>;

export type UserPreferences = {
	selected_wallets: string[];
	currency_to_show: SelectableCurrency;
    panel_to_show: Panel;
};
