import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { Component, computed, input, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { BalanceHistoryWalletDataPoint, BalanceHistoryWalletSeries, Currency } from '../../../../../infra/gateways/investments/investments-gateway.model';
import { AmountPipe } from './amount.pipe';

@Component({
    selector: 'app-balance-timeline',
    standalone: true,
    imports: [FontAwesomeModule, SlicePipe, DatePipe, CurrencyPipe, AmountPipe],
    templateUrl: './balance-timeline.component.html',
})
export class BalanceTimelineComponent implements OnInit {
    /**
     * SIGNALS
     */
    currencyOnUse = input.required<Currency>();
    data = input.required<BalanceHistoryWalletSeries[]>();
    private _triggerControls = signal<TimelineTriggerControls>({
        currPageIdx: 0,
        itemsPerPage: 0,
        pagesCount: 0,
        itemsCount: 0,
        filteredItemsCount: 0,
        sliceStart: 0,
        sliceEnd: 0,
    });
    protected unifiedData = computed<TimelineWalletDataPoint[]>(() => this.generateUnifiedDataset());
    protected icons = signal({
        faAnglesLeft: faAnglesLeft,
        faAngleLeft: faAngleLeft,
        faAngleRight: faAngleRight,
        faAnglesRight: faAnglesRight,
        faCircleInfo: faCircleInfo,
    });
    protected unifyDatasets = signal<boolean>(true);
    triggerControls = this._triggerControls.asReadonly();

    ngOnInit(): void {
        const dataLenght = this.unifiedData().length;
        const itemsPerPage = 5;
        this._triggerControls.set({
            currPageIdx: 0,
            itemsPerPage: itemsPerPage,
            pagesCount: Math.ceil(dataLenght / itemsPerPage),
            itemsCount: dataLenght,
            filteredItemsCount: dataLenght,
            sliceStart: 0,
            sliceEnd: itemsPerPage,
        });
    }

    /**
     * FUNCTIONS
     */
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

    protected nextPage(): void {
        this._triggerControls.update((currState) => {
            let currPageIdx = currState.currPageIdx + 1;
            if (currPageIdx > currState.pagesCount - 1) currPageIdx = 0;
            return {
                ...currState,
                currPageIdx,
                sliceStart: currPageIdx * currState.itemsPerPage,
                sliceEnd: currPageIdx * currState.itemsPerPage + currState.itemsPerPage,
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
            };
        });
    }

    protected firstPage(): void {
        this._triggerControls.update((currState) => ({ ...currState, currPageIdx: 0, sliceStart: 0, sliceEnd: currState.itemsPerPage }));
    }

    protected lastPage(): void {
        this._triggerControls.update((currState) => {
            let currPageIdx = currState.pagesCount - 1;
            return {
                ...currState,
                currPageIdx: currPageIdx,
                sliceStart: currPageIdx * currState.itemsPerPage,
                sliceEnd: currPageIdx * currState.itemsPerPage + currState.itemsPerPage,
            };
        });
    }
}

type TimelineWalletDataPoint = BalanceHistoryWalletDataPoint & { timeline_amount: number }

interface TimelineTriggerControls {
    currPageIdx: number;
    itemsPerPage: number;
    pagesCount: number;
    itemsCount: number;
    filteredItemsCount: number;
    sliceStart: number;
    sliceEnd: number;
}
