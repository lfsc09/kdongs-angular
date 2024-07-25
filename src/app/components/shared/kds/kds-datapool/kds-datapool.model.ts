export interface KdsDatapoolFlowControls {
	currPageIdx: number;
	rowsPerPage: number;
	pagesCount: number;
	rowsCount: number;
	filteredRowsCount: number;
}

export type KdsDatapoolSortingControls = { [key: string]: 'asc' | 'desc' };

export type KdsDatapoolFilteringControls = { [key: string]: any[] };

export interface KdsDatapoolNewDataResponse<T> {
	datapool: T[];
	pagesCount: number;
	rowsCount: number;
	filteredRowsCount: number;
}
