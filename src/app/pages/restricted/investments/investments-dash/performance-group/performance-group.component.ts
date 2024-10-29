import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { formatCurrency, formatDate } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar, faCaretDown, faCaretLeft, faCircleInfo, faCodeMerge, faEye } from '@fortawesome/free-solid-svg-icons';
import bb, { bar } from 'billboard.js';
import { getQuarter } from 'date-fns';
import cloneDeep from 'lodash.clonedeep';
import { Currency, PerformanceWalletDataPoint, PerformanceWalletSeries } from '../../../../../infra/gateways/investments/investments-gateway.model';
import { ViewportManagerService } from '../../../../../infra/services/viewport/viewport-manager.service';

type ChartDataSerie = [string, ...(number | null)[]];
type ChartGeneratedData = {
	data: {
		x?: string;
		xs?: { [key: string]: string };
		columns: ChartDataSerie[];
		type?: any;
		types?: { [key: string]: any };
		names?: { [key: string]: string };
		colors?: { [key: string]: string };
		groups?: string[][];
	};
	classes?: string[];
	area?: { [key: string]: any };
};

@Component({
	selector: 'app-performance-group',
	standalone: true,
	imports: [FontAwesomeModule, CdkMenuTrigger, CdkMenu, CdkMenuItem],
	templateUrl: './performance-group.component.html',
})
export class PerformanceGroupComponent {
    /**
     * SERVICES
     */
    private readonly viewportManagerService = inject(ViewportManagerService);

	/**
	 * CONSTS
	 */
	protected groupTimeframeLabels = ['Month', 'Quarter', 'Year'];

	/**
	 * VARS
	 */
	private chartInstance: any;
	private chartConfigs: any = {
		axis: {
			x: {
				type: 'category',
				culling: {
					lines: false,
				},
			},
			y: {
				tick: {
					format: (value: unknown) => {
						if (this.groupValueType() === 'percentage') {
							if (typeof value === 'number') return `${value.toFixed(2)}%`;
							else return `${value}%`;
						} else {
							if (typeof value === 'number') return formatCurrency(value, 'pt-br', this.currencyOnUse(), '0.0-2');
							return `${this.currencyOnUse()} ${value}`;
						}
					},
					culling: {
						lines: false,
					},
				},
			},
		},
		grid: { y: { show: true } },
		legend: {
			contents: {
				bindto: '#groupChartLegend',
				template: (id: string, color: string) => {
					return `<span class="flex flex-row items-center justify-center gap-1.5 p-2 rounded-lg bg-zinc-50">
                                <span class="rounded-full h-2 w-2" style="background-color:${color}"></span>
                                <span class="text-xs">${id}</span>
                            </span>`;
				},
			},
		},
		bar: {
			linearGradient: true,
			padding: 3,
			radius: {
				ratio: 0.1,
			},
		},
		padding: {
			right: 20,
		},
		bindto: '#groupChart',
	};

	/**
	 * SIGNALS
	 */
	currencyOnUse = input.required<Currency>();
	data = input.required({
		// Change order to youngest data to oldest, so that when showing in `Months` it can cut the oldest data out
		transform: (value: PerformanceWalletSeries[]): PerformanceWalletSeries[] => {
			let changedOrderData: PerformanceWalletSeries[] = [];
			for (let walletSerie of value) {
				changedOrderData.push({
					name: walletSerie.name,
					series: walletSerie.series.toSorted((a, b) => b.local_exit_date - a.local_exit_date),
				});
			}
			return changedOrderData;
		},
	});
	protected icons = signal({
		faCaretDown: faCaretDown,
		faCaretLeft: faCaretLeft,
		faCodeMerge: faCodeMerge,
		faCalendar: faCalendar,
		faEye: faEye,
		faCircleInfo: faCircleInfo,
	});
	protected unifyDatasets = signal<boolean>(false);
	protected groupTimeframe = signal<number>(1);
	protected groupValueType = signal<'percentage' | 'currency'>('currency');
	protected compareNetGross = signal<boolean>(false);
    private timeframeChartXLimits = computed<number>(() => {
        switch (this.viewportManagerService.currentViewport()) {
            case 'MOBILE_VERTICAL':
                return 4;
                case 'MOBILE_HORIZONTAL':
                return 6;
            case 'TABLET_VERTICAL':
            case 'TABLET_HORIZONTAL':
                return 8;
            case 'LAPTOP':
                return 12;
            case 'DESKTOP_1K':
            case 'DESKTOP_2K':
                return 15;
            default:
                return 6;
        }
    });

	constructor() {
		effect(() => {
			let chartDataConfig: ChartGeneratedData = {} as ChartGeneratedData;
			// Merge wallets
			if (this.unifyDatasets()) {
				let unifiedSeries = this.generateUnifiedDataset();
				unifiedSeries.sort((a: PerformanceWalletDataPoint, b: PerformanceWalletDataPoint) => b.local_exit_date - a.local_exit_date);
				chartDataConfig = this.generateUnifiedGroupedChart(unifiedSeries);
			} else {
				chartDataConfig = this.generateGroupedChart();
			}
			if (this.chartInstance) {
				this.chartConfigs.data = chartDataConfig?.data ?? {};
				if (chartDataConfig.classes) this.chartConfigs.line.classes = chartDataConfig.classes;
				if (chartDataConfig.area) this.chartConfigs.area = chartDataConfig.area;
			} else {
				this.chartConfigs.data = chartDataConfig?.data ?? {};
				if (chartDataConfig.classes) this.chartConfigs.line.classes = chartDataConfig.classes;
				if (chartDataConfig.area) this.chartConfigs.area = chartDataConfig.area;
				bb.generate(this.chartConfigs);
			}
		});
	}

	/**
	 * FUNCTIONS
	 */
	protected handleUnifyDatasets(): void {
		this.unifyDatasets.update((state) => !state);
	}

	protected handleGroupTimeFrameChange(): void {
		this.groupTimeframe.update((state) => (state + 1) % 3);
	}

	protected handleGroupValueTypeChange(): void {
		this.groupValueType.update((state) => (state === 'percentage' ? 'currency' : 'percentage'));
	}

	protected handleCompareNetGross(): void {
		this.compareNetGross.update((state) => !state);
	}

	private generateUnifiedDataset(): PerformanceWalletDataPoint[] {
		let unifiedSeriesMap = new Map<number, PerformanceWalletDataPoint>();
		for (let wallet of this.data()) {
			for (let dataPoint of wallet.series) {
				// Merge wallet assets into a Map, to merge equal dates to same dataPoint
				if (unifiedSeriesMap.has(dataPoint.local_exit_date)) {
					const previousMapValue = unifiedSeriesMap.get(dataPoint.local_exit_date);
					unifiedSeriesMap.set(dataPoint.local_exit_date, {
						...dataPoint,
						gross_profit: previousMapValue!.gross_profit + dataPoint.gross_profit,
						net_profit: previousMapValue!.net_profit + dataPoint.net_profit,
						days_to_profit: previousMapValue!.days_to_profit + dataPoint.days_to_profit,
					});
				} else unifiedSeriesMap.set(dataPoint.local_exit_date, { ...dataPoint });
			}
		}
		return Array.from(unifiedSeriesMap.values());
	}

	private generateTimeframeKey(epochMS: number): string {
		const date = new Date(epochMS);
		switch (this.groupTimeframeLabels[this.groupTimeframe()]) {
			case 'Month':
				return `${date.getFullYear()}-${date.getMonth() + 1}`;
			case 'Quarter':
				return `${date.getFullYear()}-Q${getQuarter(date)}`;
			case 'Year':
				return `${date.getFullYear()}`;
		}
		return 'unknown';
	}

	private formatLabel(timeframeKey: string): string {
		switch (this.groupTimeframeLabels[this.groupTimeframe()]) {
			case 'Month':
				let keyFrag = timeframeKey.split('-');
                // Using 15th, so that even with local machine timezone change, it will stay in the same month
				return formatDate(new Date(`${keyFrag[0]}-${keyFrag[1].padStart(2, '0')}-15`), 'MMM yy', 'en_US');
			case 'Quarter':
				return timeframeKey.replace('-', ' ');
			case 'Year':
				return timeframeKey;
		}
		return 'unknown';
	}

	private generateLabelTimeSignature(epochMS: number): number {
		let dateFromEpoch = new Date(epochMS);
		switch (this.groupTimeframeLabels[this.groupTimeframe()]) {
			case 'Month':
                // Using 15th, so that even with local machine timezone change, it will stay in the same month
				return new Date(`${dateFromEpoch.getFullYear()}-${`${dateFromEpoch.getMonth() + 1}`.padStart(2, '0')}-15`).getTime();
			case 'Quarter':
				const quarterToMonthMap = ['01', '01', '01', '04', '04', '04', '07', '07', '07', '10', '10', '10'];
                // Using 15th, so that even with local machine timezone change, it will stay in the same month
				return new Date(`${dateFromEpoch.getFullYear()}-${quarterToMonthMap[dateFromEpoch.getMonth()]}-15`).getTime();
			case 'Year':
                // Using 15th, so that even with local machine timezone change, it will stay in the same month
				return new Date(`${dateFromEpoch.getFullYear()}-01-15`).getTime();
		}
		return -1;
	}

	/**
	 * Generate Chart data and options for the `Unified Wallets Grouped Summed data`.
	 * This can calculate Currency values OR percentage values based on the `Input` values.
	 * It can also group data into `months`, `quarters` and `years`.
	 *     - `Months` will be reduced to only the last 12 ones, avoiding showing too much data.
	 * And show only `Net` or `Input, Gross and Net` results.
	 *     - `Input` values WILL NOT be shown if `Percentage` data is selected, since it would be illogical and always show 100%.
	 *
	 * @param dataSerie: Will be the unified array of assets ordered by `date`.
	 */
	private generateUnifiedGroupedChart(dataSerie: PerformanceWalletDataPoint[]): ChartGeneratedData {
		if (dataSerie.length === 0) return {} as ChartGeneratedData;
		let timeframeGroup: {
			[key: string]: {
				label: string;
				timeSignatureLabel: number;
				input_value: number;
				gross_profit: number;
				net_profit: number;
			};
		} = {};
		let timeframeLimits = new Map<string, null>();

		for (let dataPoint of dataSerie) {
			let groupKey = this.generateTimeframeKey(dataPoint.local_exit_date);

			if (!timeframeLimits.has(groupKey)) {
				if (timeframeLimits.size === this.timeframeChartXLimits()) continue;
				else timeframeLimits.set(groupKey, null);
			}

			if (!(groupKey in timeframeGroup)) {
				timeframeGroup[groupKey] = {
					label: this.formatLabel(groupKey),
					timeSignatureLabel: this.generateLabelTimeSignature(dataPoint.local_exit_date),
					input_value: 0,
					gross_profit: 0,
					net_profit: 0,
				};
			}

			if (this.groupValueType() === 'percentage') {
				timeframeGroup[groupKey].gross_profit += dataPoint.gross_profit / dataPoint.input_value;
				timeframeGroup[groupKey].net_profit += dataPoint.net_profit / dataPoint.input_value;
			} else {
				timeframeGroup[groupKey].input_value += dataPoint.input_value;
				timeframeGroup[groupKey].gross_profit += dataPoint.gross_profit;
				timeframeGroup[groupKey].net_profit += dataPoint.net_profit;
			}
		}

		if (this.compareNetGross()) {
			let chartInputName = `Summed Input${this.groupValueType() === 'percentage' ? ' %' : ''} by ${this.groupTimeframeLabels[this.groupTimeframe()]}`;
			let chartGrossName = `Summed Gross${this.groupValueType() === 'percentage' ? ' %' : ''} by ${this.groupTimeframeLabels[this.groupTimeframe()]}`;
			let chartNetName = `Summed Net${this.groupValueType() === 'percentage' ? ' %' : ''} by ${this.groupTimeframeLabels[this.groupTimeframe()]}`;
			let input_grouped: ChartDataSerie = [chartInputName];
			let gross_grouped: ChartDataSerie = [chartGrossName];
			let net_grouped: ChartDataSerie = [chartNetName];
			let xAxis: ChartDataSerie = ['x'];

			for (let groupedData of Object.values(timeframeGroup).toSorted((a, b) => a.timeSignatureLabel - b.timeSignatureLabel)) {
				if (this.groupValueType() === 'currency') input_grouped.push(groupedData.input_value);
				gross_grouped.push(groupedData.gross_profit);
				net_grouped.push(groupedData.net_profit);
				xAxis.push(groupedData.label);
			}

			return {
				data: {
					x: 'x',
					columns: [xAxis, input_grouped, gross_grouped, net_grouped],
					types: {
						[chartInputName]: bar(),
						[chartGrossName]: bar(),
						[chartNetName]: bar(),
					},
					colors: {
						[chartInputName]: '#64748b',
						[chartGrossName]: '#f97316',
						[chartNetName]: '#22c55e',
					},
				},
			};
		} else {
			let chartNetName = `Summed Net${this.groupValueType() === 'percentage' ? ' %' : ''} by ${this.groupTimeframeLabels[this.groupTimeframe()]}`;
			let net_grouped: ChartDataSerie = [chartNetName];
			let xAxis: ChartDataSerie = ['x'];

			for (let groupedData of Object.values(timeframeGroup).toSorted((a, b) => a.timeSignatureLabel - b.timeSignatureLabel)) {
				net_grouped.push(groupedData.net_profit);
				xAxis.push(groupedData.label);
			}

			return {
				data: {
					x: 'x',
					columns: [xAxis, net_grouped],
					types: {
						[chartNetName]: bar(),
					},
				},
			};
		}
	}

	/**
	 * Generate Chart data and options for the `Separated Wallets Grouped data`.
	 * This can calculate Currency values OR percentage values based on the `Input` values (Of each Wallet).
	 * It can also group data into `months`, `quarters` and `years`.
	 *     - `Months` will be reduced to only the last 12 ones, avoiding showing too much data.
	 * And show only `Net` or `Input, Gross and Net` results.
	 *     - `Input` values WILL NOT be shown if `Percentage` data is selected, since it would be illogical and always show 100%.
	 */
	/**
	 * TODO: Ajust colors when `Separated` datasets, to maintain the same color scheme from the unified one: Gray for Input, Orange for Gross and Green for Net.
	 * Perhaps only adjusting intensity of the colors for the different Wallets.
	 */
	private generateGroupedChart(): ChartGeneratedData {
		if (this.data().length === 0) return {} as ChartGeneratedData;
		let walletTimeframeGroup: {
			[key: string]: {
				wallet_name: string;
				timeframe_label: string;
                timeSignatureLabel: number;
				input_value: number | null;
				gross_profit: number | null;
				net_profit: number | null;
			};
		} = {};
        let monthsLimits = new Map<string, null>();

		// Filters wallets with no data
		let walletsName = this.data()
			.filter((wallet) => wallet.series.length > 0)
			.map((wallet) => wallet.name);

		for (let [idx, wallet] of this.data().entries()) {
			if (wallet.series.length === 0) continue;
			for (let dataPoint of wallet.series) {
                let timeframeKey = this.generateTimeframeKey(dataPoint.local_exit_date);
                console.log(timeframeKey);

                if (!monthsLimits.has(timeframeKey)) {
                    if (monthsLimits.size === this.timeframeChartXLimits()) continue;
                    else monthsLimits.set(timeframeKey, null);
                }

				// Force create the same timeframeKeys in all of the Wallets series
				for (let walletName of walletsName) {
					let compositeKey = `${walletName}-${timeframeKey}`;
					if (!(compositeKey in walletTimeframeGroup)) {
						walletTimeframeGroup[compositeKey] = {
							wallet_name: walletName,
							timeframe_label: this.formatLabel(timeframeKey),
                            timeSignatureLabel: this.generateLabelTimeSignature(dataPoint.local_exit_date),
							input_value: null,
							gross_profit: null,
							net_profit: null,
						};
					}
					if (walletName === wallet.name) {
						if (this.groupValueType() === 'percentage') {
							walletTimeframeGroup[compositeKey].gross_profit =
								(walletTimeframeGroup[compositeKey]?.gross_profit ?? 0) + dataPoint.gross_profit / dataPoint.input_value;
							walletTimeframeGroup[compositeKey].net_profit = (walletTimeframeGroup[compositeKey]?.net_profit ?? 0) + dataPoint.net_profit / dataPoint.input_value;
						} else {
							walletTimeframeGroup[compositeKey].input_value = (walletTimeframeGroup[compositeKey]?.net_profit ?? 0) + dataPoint.net_profit;
							walletTimeframeGroup[compositeKey].gross_profit = (walletTimeframeGroup[compositeKey]?.gross_profit ?? 0) + dataPoint.gross_profit;
							walletTimeframeGroup[compositeKey].net_profit = (walletTimeframeGroup[compositeKey]?.net_profit ?? 0) + dataPoint.net_profit;
						}
					}
				}
			}
		}

		let getInputAndGrossToo = this.compareNetGross();
		let skipInputValues = this.groupValueType() === 'percentage';
		let cutOffset = getInputAndGrossToo ? 3 : 1;
		let dataColumns: ChartDataSerie[] = [];
		let xAxis: ChartDataSerie = ['x'];
		let dataGroups: string[][] = [];

		// Initialize the dataColumns with the series names
		walletsName.forEach((walletName) => {
			if (getInputAndGrossToo) {
				if (!skipInputValues) dataColumns.push([`Input ${walletName}`]);
				dataColumns.push([`Gross ${walletName}`]);
			}
			dataColumns.push([`Net ${walletName}`]);
		});

		// Create data groups for the Chart, uniting wallets `Input` together, uniting `Gross` together and uninting `Net` together
		if (getInputAndGrossToo) {
			if (!skipInputValues) dataGroups.push(dataColumns.filter((dataSerie) => /^Input .*/.test(dataSerie[0])).map((dataSerie) => dataSerie[0]));
			dataGroups.push(dataColumns.filter((dataSerie) => /^Gross .*/.test(dataSerie[0])).map((dataSerie) => dataSerie[0]));
		}
		dataGroups.push(dataColumns.filter((dataSerie) => /^Net .*/.test(dataSerie[0])).map((dataSerie) => dataSerie[0]));

		for (let groupedData of Object.values(walletTimeframeGroup).toSorted((a, b) => a.timeSignatureLabel - b.timeSignatureLabel)) {
			if (xAxis.at(-1) !== groupedData.timeframe_label) xAxis.push(groupedData.timeframe_label);

			let cutIdx = 0;
			for (let dCIdx = 0; dCIdx < dataColumns.length; dCIdx++) {
				if (getInputAndGrossToo && !skipInputValues && `Input ${groupedData.wallet_name}` === dataColumns[dCIdx][0]) {
					dataColumns[dCIdx].push(groupedData.input_value);
					cutIdx++;
				} else if (getInputAndGrossToo && `Gross ${groupedData.wallet_name}` === dataColumns[dCIdx][0]) {
					dataColumns[dCIdx].push(groupedData.gross_profit);
					cutIdx++;
				} else if (`Net ${groupedData.wallet_name}` === dataColumns[dCIdx][0]) {
					dataColumns[dCIdx].push(groupedData.net_profit);
					cutIdx++;
				}
				// If `Net` or `Input, Gross, Net` all found, stop looking
				if (cutIdx === cutOffset) break;
			}
		}

		dataColumns.push([...xAxis]);

		return {
			data: {
				x: 'x',
				columns: dataColumns,
				type: bar(),
				groups: cloneDeep(dataGroups),
			},
		};
	}
}
