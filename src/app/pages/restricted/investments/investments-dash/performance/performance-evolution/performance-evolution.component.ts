import { CdkMenu, CdkMenuTrigger } from '@angular/cdk/menu';
import { formatCurrency, formatDate } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faCircleInfo, faCodeMerge, faEye } from '@fortawesome/free-solid-svg-icons';
import bb, { areaSpline, spline } from 'billboard.js';
import cloneDeep from 'lodash.clonedeep';
import { Currency, PerformanceWalletDataPoint, PerformanceWalletSeries } from '../../../../../../infra/gateways/investments/investments-gateway.model';

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
	selector: 'app-performance-evolution',
	standalone: true,
	imports: [FontAwesomeModule, CdkMenuTrigger, CdkMenu],
	templateUrl: './performance-evolution.component.html',
})
export class PerformanceEvolutionComponent {
	/**
	 * CONSTS
	 */
	// 30 days in milliseconds
	private thirdyDaysMS = 2592000000;
	private forecastTimes = 2;
	private tendenciesValues = {
		shorter: { short: 5, long: 20 },
		longer: { short: 21, long: 100 },
	};

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
	data = input.required<PerformanceWalletSeries[]>();
	protected icons = signal({
		faCaretDown: faCaretDown,
		faCodeMerge: faCodeMerge,
		faCircleInfo: faCircleInfo,
		faEye: faEye,
	});
	protected unifyDatasets = signal<boolean>(true);
	protected compareNetGross = signal<boolean>(false);

	constructor() {
		effect(() => {
			let chartDataConfig: ChartGeneratedData = {} as ChartGeneratedData;
			// Merge wallets evolution
			if (this.unifyDatasets()) {
				let unifiedSeries = this.generateUnifiedDataset();
				unifiedSeries.sort((a: PerformanceWalletDataPoint, b: PerformanceWalletDataPoint) => a.local_exit_date - b.local_exit_date);
				// Generate comparison of Net & Gross profit
				if (this.compareNetGross()) {
					chartDataConfig = this.generateUnifiedNetGrossCompareChart(unifiedSeries);
				} else {
					chartDataConfig = this.generateUnifiedNetWithTendencyChart(unifiedSeries);
				}
			}
			// Generate evolution of wallets separated
			else {
				chartDataConfig = this.generateSeparateWalletsNetChart();
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
		this.compareNetGross.set(false);
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

	/**
	 * Generate Chart data and options for the `Unified Wallets Comparing Net & Gross Profits`, which will caculate Net and Gross profits of wallets unified.
	 * This means that will take all the assets from the wallets and unify them in a single timeline.
	 *
	 * @param dataSerie: Will be the unified array of assets ordered by `date`.
	 */
	private generateUnifiedNetGrossCompareChart(dataSerie: PerformanceWalletDataPoint[]): ChartGeneratedData {
		if (dataSerie.length === 0) return {} as ChartGeneratedData;
		let net_evolution_value = 0;
		let gross_evolution_value = 0;
		let net_evolution: ChartDataSerie = ['Summed Net Profit'];
		let gross_evolution: ChartDataSerie = ['Summed Gross Profit'];
		let xAxis: ChartDataSerie = ['x'];
		let forecastAverage: { days_to_profit: number; net_profit: number; gross_profit: number; net_profit_per_day: number; gross_profit_per_day: number } = {
			days_to_profit: 0,
			net_profit: 0,
			gross_profit: 0,
			net_profit_per_day: 0,
			gross_profit_per_day: 0,
		};

		for (let dataPoint of dataSerie) {
			xAxis.push(dataPoint.local_exit_date);
			net_evolution_value += dataPoint.net_profit;
			gross_evolution_value += dataPoint.gross_profit;
			net_evolution.push(net_evolution_value.toFixed(2));
			gross_evolution.push(gross_evolution_value.toFixed(2));
			forecastAverage.days_to_profit += dataPoint.days_to_profit;
			forecastAverage.net_profit += dataPoint.net_profit;
			forecastAverage.gross_profit += dataPoint.gross_profit;
		}

		forecastAverage.days_to_profit /= dataSerie.length;
		forecastAverage.net_profit /= dataSerie.length;
		forecastAverage.gross_profit /= dataSerie.length;
		forecastAverage.net_profit_per_day = forecastAverage.net_profit / forecastAverage.days_to_profit;
		forecastAverage.gross_profit_per_day = forecastAverage.gross_profit / forecastAverage.days_to_profit;

		// Add a forecast of next data
		for (let fIdx = 1; fIdx <= this.forecastTimes; fIdx++) {
			xAxis.push(dataSerie.at(-1)!.local_exit_date + this.thirdyDaysMS * fIdx);
			net_evolution.push((net_evolution_value + forecastAverage.net_profit_per_day * (30 * fIdx)).toFixed(2));
			gross_evolution.push((gross_evolution_value + forecastAverage.gross_profit_per_day * (30 * fIdx)).toFixed(2));
		}

		return {
			data: {
				x: 'x',
				columns: [xAxis, gross_evolution, net_evolution],
				types: {
					'Summed Gross Profit': areaSpline(),
					'Summed Net Profit': areaSpline(),
				},
				colors: {
					'Summed Gross Profit': '#f97316',
					'Summed Net Profit': '#22c55e',
				},
				regions: {
					'Summed Gross Profit': [{ start: xAxis.at(-3), style: { dasharray: '4 4' } }],
					'Summed Net Profit': [{ start: xAxis.at(-3), style: { dasharray: '4 4' } }],
				},
			},
			classes: ['billboard-lines-thick', 'billboard-lines-thick'],
			area: {
				linearGradient: true,
			},
		};
	}

	/**
	 * Generate Chart data and options for the `Unified Wallets Net Profits with Tendency`, which will calculate Net profit of wallets unifed.
	 * This means that will take all the assets from the wallets and unify them in a single timeline.
	 *
	 * @param dataSerie: Will be the unified array of assets ordered by `date`.
	 */
	private generateUnifiedNetWithTendencyChart(dataSerie: PerformanceWalletDataPoint[]): ChartGeneratedData {
		if (dataSerie.length === 0) return {} as ChartGeneratedData;
		let net_evolution_value = 0;
		let net_evolution: ChartDataSerie = ['Summed Net Profit'];
		let xAxis: ChartDataSerie = ['x'];
		let forecastAverage: { days_to_profit: number; net_profit: number; net_profit_per_day: number } = {
			days_to_profit: 0,
			net_profit: 0,
			net_profit_per_day: 0,
		};

		for (let dataPoint of dataSerie) {
			xAxis.push(dataPoint.local_exit_date);
			net_evolution_value += dataPoint.net_profit;
			net_evolution.push(net_evolution_value.toFixed(2));
			forecastAverage.days_to_profit += dataPoint.days_to_profit;
			forecastAverage.net_profit += dataPoint.net_profit;
		}

		forecastAverage.days_to_profit /= dataSerie.length;
		forecastAverage.net_profit /= dataSerie.length;
		forecastAverage.net_profit_per_day = forecastAverage.net_profit / forecastAverage.days_to_profit;

		/**
		 * TODO: Add the two tendency lines.
		 */

		// Add a forecast of next data
		for (let fIdx = 1; fIdx <= this.forecastTimes; fIdx++) {
			xAxis.push(dataSerie.at(-1)!.local_exit_date + this.thirdyDaysMS * fIdx);
			net_evolution.push((net_evolution_value + forecastAverage.net_profit_per_day * (30 * fIdx)).toFixed(2));
		}

		return {
			data: {
				x: 'x',
				columns: [xAxis, net_evolution],
				types: {
					'Summed Net Profit': areaSpline(),
				},
				regions: {
					'Summed Net Profit': [{ start: xAxis.at(-3), style: { dasharray: '4 4' } }],
				},
			},
			classes: ['billboard-lines-thick'],
			area: {
				linearGradient: true,
			},
		};
	}

	/**
	 * Generate Chart data and options for the `Separate Wallets Net Profits`, which will calculate Net profit of each wallet individualy.
	 */
	private generateSeparateWalletsNetChart(): ChartGeneratedData {
		if (this.data().length === 0) return {} as ChartGeneratedData;
		let dataColumns: ChartDataSerie[] = [];
		let dataXSMap: { [key: string]: string } = {};
		let dataRegions: { [key: string]: any[] } = {};
		let dataClasses: string[] = [];

		for (let [idx, wallet] of this.data().entries()) {
			if (wallet.series.length === 0) continue;
			let net_evolution_value = 0;
			let net_evolution: ChartDataSerie = [wallet.name];
			let xAxis: ChartDataSerie = [`x${idx}`];
			let forecastAverage: { days_to_profit: number; net_profit: number; net_profit_per_day: number } = {
				days_to_profit: 0,
				net_profit: 0,
				net_profit_per_day: 0,
			};

			dataXSMap[wallet.name] = `x${idx}`;
			dataClasses.push('billboard-lines-thick');

			for (let dataPoint of wallet.series) {
				xAxis.push(dataPoint.local_exit_date);
				net_evolution_value += dataPoint.net_profit;
				net_evolution.push(net_evolution_value.toFixed(2));
				forecastAverage.days_to_profit += dataPoint.days_to_profit;
				forecastAverage.net_profit += dataPoint.net_profit;
			}

			forecastAverage.days_to_profit /= wallet.series.length;
			forecastAverage.net_profit /= wallet.series.length;
			forecastAverage.net_profit_per_day = forecastAverage.net_profit / forecastAverage.days_to_profit;

			// Add a forecast of next data
			for (let fIdx = 1; fIdx <= this.forecastTimes; fIdx++) {
				xAxis.push(wallet.series.at(-1)!.local_exit_date + this.thirdyDaysMS * fIdx);
				net_evolution.push((net_evolution_value + forecastAverage.net_profit_per_day * (30 * fIdx)).toFixed(2));
			}
			dataColumns.push([...net_evolution]);
			dataColumns.push([...xAxis]);
			dataRegions[wallet.name] = [{ start: xAxis.at(-3), style: { dasharray: '4 4' } }];
		}

		return {
			data: {
				xs: { ...dataXSMap },
				columns: dataColumns,
				type: spline(),
				regions: cloneDeep(dataRegions),
			},
			classes: [...dataClasses],
		};
	}
}
