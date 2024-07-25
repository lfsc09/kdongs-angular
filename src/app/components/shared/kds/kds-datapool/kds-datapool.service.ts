import { Injectable, Signal, signal } from '@angular/core';
import { KdsDatapoolFlowControls, KdsDatapoolNewDataResponse } from './kds-datapool.model';
import { GetDatapoolResponse } from '../../../../infra/gateways/users/users-gateway.model';

@Injectable()
export class KdsDatapoolService {
	/**
	 * SIGNALS
	 */
	private _flowControls = signal<KdsDatapoolFlowControls>({
		currPageIdx: 0,
		pagesCount: 0,
		rowsCount: 0,
		rowsPerPage: 0,
		filteredRowsCount: 0,
	});
	private _datapool = signal<unknown[]>([]);

	flowControls = this._flowControls.asReadonly();

	getDatapool<T = any>(): Signal<T[]> {
		return this._datapool.asReadonly() as Signal<T[]>;
	}

	newDataReceived<D>(response: KdsDatapoolNewDataResponse<D>) {
		this._flowControls.update((currState) => ({ ...currState, pagesCount: response.pagesCount, rowsCount: response.rowsCount, filteredRowsCount: response.filteredRowsCount }));
        this._datapool.set(response.datapool);
	}

	nextPage() {
		this._flowControls.update((currState) => {
			let currPageIdx = currState.currPageIdx + 1;
			if (currPageIdx > currState.pagesCount - 1) currPageIdx = 0;
			return {
				...currState,
				currPageIdx,
			};
		});
	}

	previousPage() {
		this._flowControls.update((currState) => {
			let currPageIdx = currState.currPageIdx - 1;
			if (currPageIdx < 0) currPageIdx = currState.pagesCount - 1;
			return {
				...currState,
				currPageIdx,
			};
		});
	}

	firstPage() {
		this._flowControls.update((currState) => ({ ...currState, currPageIdx: 0 }));
	}

	lastPage() {
		this._flowControls.update((currState) => ({ ...currState, currPageIdx: this._flowControls().pagesCount - 1 }));
	}

	gotoPage(currPage: number) {
		let currPageIdx = currPage - 1;
		if (currPageIdx < 0) currPageIdx = 0;
		else if (currPageIdx > this._flowControls().pagesCount - 1) currPageIdx = this._flowControls().pagesCount - 1;
		this._flowControls.update((currState) => ({ ...currState, currPageIdx }));
	}

	updateRowsPerPage(rowsPerPage: number) {
		this._flowControls.update((currState) => ({ ...currState, rowsPerPage }));
	}
}
