import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown, faArrowRightArrowLeft, faArrowUp, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { KdsComparisonArrowComponent } from '../../../../../components/shared/kds/kds-comparison-arrow/kds-comparison-arrow.component';
import { KdsGaugeComponent } from '../../../../../components/shared/kds/kds-gauge/kds-gauge.component';
import { Currency, PerformanceData } from '../../../../../infra/gateways/investments/investments-gateway.model';

@Component({
	selector: 'app-performance-indicators',
	standalone: true,
	imports: [FontAwesomeModule, CurrencyPipe, PercentPipe, DatePipe, KdsGaugeComponent, KdsComparisonArrowComponent],
	templateUrl: './performance-indicators.component.html',
})
export class PerformanceIndicatorsComponent {
	/**
	 * SIGNALS
	 */
	currencyOnUse = input.required<Currency>();
	data = input.required<PerformanceData>();
	protected icons = signal({
		faArrowRightArrowLeft: faArrowRightArrowLeft,
		faCircleInfo: faCircleInfo,
		faArrowDown: faArrowDown,
		faArrowUp: faArrowUp,
	});
	protected compareWithTotal = signal<boolean>(false);

	/**
	 * FUNCTIONS
	 */
	handleCompareWithTotalChange(): void {
		this.compareWithTotal.update((state) => !state);
	}
}
