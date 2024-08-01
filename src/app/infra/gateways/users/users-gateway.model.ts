export interface DatapoolUser {
	id: string;
	inactive_flag: boolean;
	admin_flag: boolean;
	username: string;
	name: string;
	email: string;
}

export interface GetDatapool {
	pagePool: DatapoolUser[];
	pagesCount: number;
	itemsCount: number;
	filteredItemsCount: number;
}

export type GetDatapoolResponse = GetDatapool | null;

export interface GetDatapoolRequest {
	currPageIdx: number;
	itemsPerPage: number;
}
