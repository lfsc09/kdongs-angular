export interface DatapoolUser {
	id: string;
	admin_flag: boolean;
	username: string;
	name: string;
	email: string;
}

export interface GetDatapool {
	datapool: DatapoolUser[];
	pagesCount: number;
	rowsCount: number;
	filteredRowsCount: number;
}

export type GetDatapoolResponse = GetDatapool | null;

export interface GetDatapoolRequest {
	currPageIdx: number;
	rowsPerPage: number;
}
