export interface DatapoolUser {
	id: string;
	inactive_flag: boolean;
	admin_flag: boolean;
	name: string;
	email: string;
}

export interface GetUsersDatapool {
	pagePool: DatapoolUser[];
	pagesCount: number;
	itemsCount: number;
	filteredItemsCount: number;
}

export type GetUsersDatapoolResponse = GetUsersDatapool | null;

export interface GetUsersDatapoolRequest {
	currPageIdx: number;
	itemsPerPage: number;
}
