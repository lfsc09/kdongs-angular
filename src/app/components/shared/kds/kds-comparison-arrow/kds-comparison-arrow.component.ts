import { Component, input, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'kds-comparison-arrow',
	standalone: true,
	imports: [FontAwesomeModule],
	styles: `
		:host {
			@apply flex flex-col items-center justify-center;
		}
	`,
	host: {
		'[class.hidden]': 'hide()',
	},
	template: `
		@if (value() > baseValue()) {
			<fa-icon
				[icon]="icons().faArrowUp"
				class="{{ svgSizes[size()].sizeClass }}"
				[class.text-emerald-600]="!inverse()"
				[class.text-red-500]="inverse()"
			></fa-icon>
		} @else if (value() < baseValue()) {
			<fa-icon
				[icon]="icons().faArrowDown"
				class="{{ svgSizes[size()].sizeClass }}"
				[class.text-red-500]="!inverse()"
				[class.text-emerald-600]="inverse()"
			></fa-icon>
		} @else {
			<span class="hidden"></span>
		}
	`,
})
export class KdsComparisonArrowComponent implements OnInit {
	/**
	 * SIGNALS
	 */
	baseValue = input.required<number>();
	value = input.required<number>();
	inverse = input<boolean>(false);
	size = input<'xs' | 'sm' | 'md' | 'lg'>('md');
	protected icons = signal({
		faArrowDown: faArrowDown,
		faArrowUp: faArrowUp,
	});
	protected hide = signal<boolean>(false);

	/**
	 * VARS
	 */
	protected svgSizes = {
		xs: {
			sizeClass: '!text-[.7rem]',
		},
		sm: {
			sizeClass: '!text-sm',
		},
		md: {
			sizeClass: '!text-base',
		},
		lg: {
			sizeClass: '!text-xl',
		},
	};

	ngOnInit(): void {
		if (this.value() === this.baseValue()) this.hide.set(true);
	}
}
