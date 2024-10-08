import { signal } from '@angular/core';

export class KdsDatapool<T> {
	/**
	 * SIGNALS
	 */
	protected loadingDatapool = signal<boolean>(false);
	protected itemsSelected = signal<number>(0);
	private _datapool = signal<KdsDatapoolData<T>>({
		metadata: {
			pagesCount: 0,
			itemsCount: 0,
			filteredItemsCount: 0,
		},
		pagePool: [],
	});
	private _triggerControls = signal<KdsDatapoolTriggerControls>({
		currPageIdx: 0,
		itemsPerPage: 15,
	});
	protected triggerControls = this._triggerControls.asReadonly();
	protected datapool = this._datapool.asReadonly();

	/**
	 * FUNCTIONS
	 */
	updateKdsDatapool(response: KdsDatapoolDataResponse<T>): void {
		this._datapool.set({
			metadata: {
				pagesCount: response.pagesCount,
				itemsCount: response.itemsCount,
				filteredItemsCount: response.filteredItemsCount,
			},
			pagePool: response.pagePool,
		});
	}

	updateTriggerControls(currPageIdx: number, itemsPerPage: number): void {
		const pagesCount = this.datapool().metadata.pagesCount;
		let itemsPerPageChanged: boolean = this._triggerControls().itemsPerPage !== itemsPerPage;
		let newCurrPageIdx = itemsPerPageChanged ? 0 : currPageIdx < 0 ? 0 : currPageIdx > pagesCount - 1 ? pagesCount - 1 : currPageIdx;
		let currPageIdxChanged: boolean = this._triggerControls().currPageIdx !== newCurrPageIdx;
		if (currPageIdxChanged || itemsPerPageChanged) this._triggerControls.set({ currPageIdx: newCurrPageIdx, itemsPerPage });
	}

	resetKdsDatapool(): void {
		this._datapool.set({
			metadata: {
				pagesCount: 0,
				itemsCount: 0,
				filteredItemsCount: 0,
			},
			pagePool: [],
		});
		this._triggerControls.update((currState) => ({ ...currState, currPageIdx: 0 }));
	}

	nextPage(): void {
		const pagesCount = this.datapool().metadata.pagesCount;
		this._triggerControls.update((currState) => {
			let currPageIdx = currState.currPageIdx + 1;
			if (currPageIdx > pagesCount - 1) currPageIdx = 0;
			return {
				...currState,
				currPageIdx,
			};
		});
	}

	previousPage(): void {
		const pagesCount = this.datapool().metadata.pagesCount;
		this._triggerControls.update((currState) => {
			let currPageIdx = currState.currPageIdx - 1;
			if (currPageIdx < 0) currPageIdx = pagesCount - 1;
			return {
				...currState,
				currPageIdx,
			};
		});
	}

	firstPage(): void {
		this._triggerControls.update((currState) => ({ ...currState, currPageIdx: 0 }));
	}

	lastPage(): void {
		const pagesCount = this.datapool().metadata.pagesCount;
		this._triggerControls.update((currState) => ({ ...currState, currPageIdx: pagesCount - 1 }));
	}
}

interface KdsDatapoolTriggerControls {
	currPageIdx: number;
	itemsPerPage: number;
}

interface KdsDatapoolData<T> {
	metadata: {
		pagesCount: number;
		itemsCount: number;
		filteredItemsCount: number;
	};
	pagePool: T[];
}

interface KdsDatapoolDataResponse<T> {
	pagesCount: number;
	itemsCount: number;
	filteredItemsCount: number;
	pagePool: T[];
}

export type KdsDatapoolSortingControls = { [key: string]: 'asc' | 'desc' };

export type KdsDatapoolFilteringControls = { [key: string]: any[] };
