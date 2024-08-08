export interface UsersListFilterOutput {
	currPageIdx: number;
	itemsPerPage: number;
	filters: {
		inactive: boolean;
		users: string[];
		emails: string[];
	};
}