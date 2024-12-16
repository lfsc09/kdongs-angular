import { animate, query, style, transition, trigger } from '@angular/animations';
import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { Component, OnInit, computed, input, output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight, faCircleInfo, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { BalanceHistoryWalletDataPoint, BalanceHistoryWalletSeries, Currency } from '../../../../../infra/gateways/investments/investments-gateway.model';
import { BalanceAction, BalanceDepositForm, BalanceWithdrawForm } from '../balance-control/balance-control.component';
import { AmountPipe } from './amount.pipe';

@Component({
	selector: 'app-balance-timeline',
	standalone: true,
	imports: [FontAwesomeModule, SlicePipe, DatePipe, CurrencyPipe, AmountPipe],
	templateUrl: './balance-timeline.component.html',
	animations: [
		trigger('slideLeftRight', [
			transition('void => right', [
				query(':self', [style({ opacity: 0, transform: 'translateX(25px)' }), animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))], {
					optional: true,
				}),
			]),
			transition('void => left', [
				query(':self', [style({ opacity: 0, transform: 'translateX(-25px)' }), animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))], {
					optional: true,
				}),
			]),
		]),
	],
})
export class BalanceTimelineComponent implements OnInit {
	/**
	 * SIGNALS
	 */
	showBalanceEditControls = input.required<boolean>();
	balanceEdit = output<BalanceEditEvent>();
	currencyOnUse = input.required<Currency>();
	data = input.required<BalanceHistoryWalletSeries[]>();
	protected icons = signal({
		faAnglesLeft: faAnglesLeft,
		faAngleLeft: faAngleLeft,
		faAngleRight: faAngleRight,
		faAnglesRight: faAnglesRight,
		faCircleInfo: faCircleInfo,
		faPen: faPen,
		faTrashCan: faTrashCan,
	});
	protected unifiedData = computed<TimelineWalletDataPoint[]>(() => this.generateUnifiedDataset());
	protected unifyDatasets = signal<boolean>(true);
	private _triggerControls = signal<TimelineTriggerControls>({
		currPageIdx: 0,
		itemsPerPage: 0,
		pagesCount: 0,
		itemsCount: 0,
		filteredItemsCount: 0,
		sliceStart: 0,
		sliceEnd: 0,
		animationDirection: undefined,
	});
	triggerControls = this._triggerControls.asReadonly();

	ngOnInit(): void {
		const dataLenght = this.unifiedData().length;
		const itemsPerPage = 7;
		this._triggerControls.set({
			currPageIdx: 0,
			itemsPerPage: itemsPerPage,
			pagesCount: Math.ceil(dataLenght / itemsPerPage),
			itemsCount: dataLenght,
			filteredItemsCount: dataLenght,
			sliceStart: 0,
			sliceEnd: itemsPerPage,
			animationDirection: 'right',
		});
	}

	/**
	 * FUNCTIONS
	 */
	protected nextPage(): void {
		this._triggerControls.update((currState) => {
			let currPageIdx = currState.currPageIdx + 1;
			if (currPageIdx > currState.pagesCount - 1) currPageIdx = 0;
			return {
				...currState,
				currPageIdx,
				sliceStart: currPageIdx * currState.itemsPerPage,
				sliceEnd: currPageIdx * currState.itemsPerPage + currState.itemsPerPage,
				animationDirection: 'right',
			};
		});
	}

	protected previousPage(): void {
		this._triggerControls.update((currState) => {
			let currPageIdx = currState.currPageIdx - 1;
			if (currPageIdx < 0) currPageIdx = currState.pagesCount - 1;
			return {
				...currState,
				currPageIdx,
				sliceStart: currPageIdx * currState.itemsPerPage,
				sliceEnd: currPageIdx * currState.itemsPerPage + currState.itemsPerPage,
				animationDirection: 'left',
			};
		});
	}

	protected firstPage(): void {
		this._triggerControls.update((currState) => ({
			...currState,
			currPageIdx: 0,
			sliceStart: 0,
			sliceEnd: currState.itemsPerPage,
			animationDirection: 'left',
		}));
	}

	protected lastPage(): void {
		this._triggerControls.update((currState) => {
			let currPageIdx = currState.pagesCount - 1;
			return {
				...currState,
				currPageIdx: currPageIdx,
				sliceStart: currPageIdx * currState.itemsPerPage,
				sliceEnd: currPageIdx * currState.itemsPerPage + currState.itemsPerPage,
				animationDirection: 'right',
			};
		});
	}

	protected handleBalanceEdit(timelinePoint: TimelineWalletDataPoint): void {
		if (timelinePoint.movement_type === 'asset_result') return;
		this.balanceEdit.emit({
			type: timelinePoint.movement_type as BalanceAction,
			values: {
				balance_id: timelinePoint.balance_id,
				localDate: new Date(timelinePoint.local_date).toISOString().split('T')[0],
				institution: timelinePoint.institution,
				details: timelinePoint.details,
				originCurrency: timelinePoint.origin_currency,
				originAmount: timelinePoint.origin_amount.toFixed(2),
				originExchGrossRate: timelinePoint.origin_exch_gross_rate?.toFixed(3) ?? '',
				originExchOpFee: timelinePoint.origin_exch_op_fee?.toFixed(3) ?? '',
				originExchVetRate: timelinePoint.origin_exch_vet_rate?.toFixed(3) ?? '',
				resultCurrency: timelinePoint.result_currency,
				resultAmount: timelinePoint.result_amount.toFixed(2),
			},
		});
	}

	private generateUnifiedDataset(): TimelineWalletDataPoint[] {
		let unifiedSeriesMap = new Map<number, TimelineWalletDataPoint>();
		for (let wallet of this.data()) {
			for (let dataPoint of wallet.series) {
				// Merge wallet assets into a Map, to merge equal dates to same dataPoint
				if (unifiedSeriesMap.has(dataPoint.local_date)) {
					const previousMapValue = unifiedSeriesMap.get(dataPoint.local_date);
					unifiedSeriesMap.set(dataPoint.local_date, {
						...dataPoint,
						result_amount: previousMapValue!.result_amount + dataPoint.result_amount,
						timeline_amount: 0,
					});
				} else unifiedSeriesMap.set(dataPoint.local_date, { ...dataPoint, timeline_amount: 0 });
			}
		}
		let orderedUnifiedDataset = Array.from(unifiedSeriesMap.values());
		orderedUnifiedDataset.sort((a: TimelineWalletDataPoint, b: TimelineWalletDataPoint) => a.local_date - b.local_date);
		unifiedSeriesMap.clear();
		for (let uI = 0; uI < orderedUnifiedDataset.length; uI++)
			orderedUnifiedDataset[uI].timeline_amount = (orderedUnifiedDataset?.[uI - 1]?.timeline_amount ?? 0) + orderedUnifiedDataset[uI].result_amount;

		return orderedUnifiedDataset;
	}
}

type TimelineWalletDataPoint = BalanceHistoryWalletDataPoint & { timeline_amount: number };

interface TimelineTriggerControls {
	currPageIdx: number;
	itemsPerPage: number;
	pagesCount: number;
	itemsCount: number;
	filteredItemsCount: number;
	sliceStart: number;
	sliceEnd: number;
	animationDirection: 'right' | 'left' | undefined;
}

export type BalanceEditEvent = { type: BalanceAction; values: BalanceDepositForm | BalanceWithdrawForm };
