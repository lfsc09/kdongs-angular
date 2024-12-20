import { CdkMenu, CdkMenuTrigger } from '@angular/cdk/menu';
import { formatCurrency, formatDate } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faCircleInfo, faCodeMerge } from '@fortawesome/free-solid-svg-icons';
import bb, { area, line } from 'billboard.js';
import { BalanceHistoryWalletDataPoint, BalanceHistoryWalletSeries, Currency } from '../../../../../../infra/gateways/investments/investments-gateway.model';

type ChartDataSerie = [string, ...number[]];
type ChartGeneratedData = {
	data: {
		x?: string;
		xs?: { [key: string]: string };
		columns: ChartDataSerie[];
		type?: any;
		types?: { [key: string]: any };
		names?: { [key: string]: string };
		colors?: { [key: string]: string };
		regions?: { [key: string]: any[] };
	};
	classes?: string[];
	area?: { [key: string]: any };
};

@Component({
	selector: 'app-balance-evolution',
	standalone: true,
	imports: [FontAwesomeModule, CdkMenuTrigger, CdkMenu],
	templateUrl: './balance-evolution.component.html',
})
export class BalanceEvolutionComponent {
	/**
	 * VARS
	 */
	private chartInstance: any;
	private chartConfigs: any = {
		axis: {
			x: {
				type: 'timeseries',
				tick: {
					format: (value: string | number) => {
						return formatDate(value, 'MMM yy', 'en_US');
					},
					culling: {
						lines: false,
					},
				},
			},
			y: {
				tick: {
					format: (value: unknown) => {
						if (typeof value === 'number') return formatCurrency(value, 'pt-br', this.currencyOnUse(), '0.0-2');
						return `${this.currencyOnUse()} ${value}`;
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
				bindto: '#evolutionChartLegend',
				template: (id: string, color: string) => {
					return `<span class="flex flex-row items-center justify-center gap-1.5 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700">
                                <span class="rounded-full h-2 w-2" style="background-color:${color}"></span>
                                <span class="text-xs">${id}</span>
                            </span>`;
				},
			},
		},
		line: {
			classes: ['billboard-lines-thick'],
		},
		padding: {
			right: 20,
		},
		point: {
			focus: {
				only: true,
			},
		},
		tooltip: {
			format: {
				title: (title: number | string) => {
					return formatDate(title, 'dd MMM yy', 'en_US');
				},
			},
		},
		bindto: '#evolutionChart',
	};

	/**
	 * SIGNALS
	 */
	currencyOnUse = input.required<Currency>();
	data = input.required<BalanceHistoryWalletSeries[]>();
	protected icons = signal({
		faCaretDown: faCaretDown,
		faCodeMerge: faCodeMerge,
		faCircleInfo: faCircleInfo,
	});
	protected unifyDatasets = signal<boolean>(true);

	constructor() {
		effect(() => {
			let chartDataConfig: ChartGeneratedData = {} as ChartGeneratedData;
			// Merge wallets evolution
			if (this.unifyDatasets()) {
				let unifiedSeries = this.generateUnifiedDataset();
				unifiedSeries.sort((a: BalanceHistoryWalletDataPoint, b: BalanceHistoryWalletDataPoint) => a.local_date - b.local_date);
				chartDataConfig = this.generateUnifiedBalanceWithTendencyChart(unifiedSeries);
			}
			// Generate evolution of wallets separated
			else {
				chartDataConfig = this.generateSeparateWalletsBalanceChart();
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

	private generateUnifiedDataset(): BalanceHistoryWalletDataPoint[] {
		let unifiedSeriesMap = new Map<number, BalanceHistoryWalletDataPoint>();
		for (let wallet of this.data()) {
			for (let dataPoint of wallet.series) {
				// Merge wallet assets into a Map, to merge equal dates to same dataPoint
				if (unifiedSeriesMap.has(dataPoint.local_date)) {
					const previousMapValue = unifiedSeriesMap.get(dataPoint.local_date);
					unifiedSeriesMap.set(dataPoint.local_date, {
						...dataPoint,
						result_amount: previousMapValue!.result_amount + dataPoint.result_amount,
					});
				} else unifiedSeriesMap.set(dataPoint.local_date, { ...dataPoint });
			}
		}
		return Array.from(unifiedSeriesMap.values());
	}

	/**
	 * Generate Chart data and options for the `Unified Wallets Balance with Tendency`, which will calculate the Balance of wallets unifed.
	 * This means that will take all the assets from the wallets and unify them in a single timeline.
	 *
	 * @param dataSerie: Will be the unified array of assets ordered by `date`.
	 */
	private generateUnifiedBalanceWithTendencyChart(dataSerie: BalanceHistoryWalletDataPoint[]): ChartGeneratedData {
		if (dataSerie.length === 0) return {} as ChartGeneratedData;
		let balance_evolution_value = 0;
		let balance_evolution: ChartDataSerie = ['Summed Balance'];
		let xAxis: ChartDataSerie = ['x'];

		for (let dataPoint of dataSerie) {
			xAxis.push(dataPoint.local_date);
			balance_evolution_value += dataPoint.result_amount;
			balance_evolution.push(balance_evolution_value.toFixed(2));
		}

		/**
		 * TODO: Add the two tendency lines.
		 */

		return {
			data: {
				x: 'x',
				columns: [xAxis, balance_evolution],
				types: {
					'Summed Balance': area(),
				},
			},
			classes: ['billboard-lines-thick'],
			area: {
				linearGradient: true,
			},
		};
	}

	/**
	 * Generate Chart data and options for the `Separate Wallets Balance`, which will calculate Balance History of each wallet individualy.
	 */
	private generateSeparateWalletsBalanceChart(): ChartGeneratedData {
		if (this.data().length === 0) return {} as ChartGeneratedData;
		let dataColumns: ChartDataSerie[] = [];
		let dataXSMap: { [key: string]: string } = {};
		let dataClasses: string[] = [];

		for (let [idx, wallet] of this.data().entries()) {
			if (wallet.series.length === 0) continue;
			let balance_evolution_value = 0;
			let balance_evolution: ChartDataSerie = [wallet.name];
			let xAxis: ChartDataSerie = [`x${idx}`];

			dataXSMap[wallet.name] = `x${idx}`;
			dataClasses.push('billboard-lines-thick');

			for (let dataPoint of wallet.series) {
				xAxis.push(dataPoint.local_date);
				balance_evolution_value += dataPoint.result_amount;
				balance_evolution.push(balance_evolution_value.toFixed(2));
			}

			dataColumns.push([...balance_evolution]);
			dataColumns.push([...xAxis]);
		}

		return {
			data: {
				xs: { ...dataXSMap },
				columns: dataColumns,
				type: line(),
			},
			classes: [...dataClasses],
		};
	}
}
