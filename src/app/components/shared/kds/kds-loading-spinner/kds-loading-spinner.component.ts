import { Component, input } from '@angular/core';

@Component({
	selector: 'kds-loading-spinner',
	standalone: true,
	imports: [],
	styles: `
		:host {
			@apply flex transition-opacity delay-150 ease-in-out;
		}
	`,
	template: `
		<span class="kds-loading-spinner-outer {{ sizes[size()] }}">
			<svg
				class="block"
				viewBox="22 22 44 44"
			>
				<circle
					class="kds-loading-spinner-inner {{ colors[color()] }}"
					cx="44"
					cy="44"
					r="20.2"
					fill="none"
					stroke-width="3.6"
				></circle>
			</svg>
		</span>
	`,
})
export class KdsLoadingSpinnerComponent {
	/**
	 * SIGNALS
	 */
	size = input<'sm' | 'md' | 'lg' | 'xl'>('sm');
	color = input<'white' | 'neutral' | 'dongs'>('white');

	/**
	 * VARS
	 */
	protected sizes = {
		sm: 'h-4 w-4',
		md: 'h-6 w-6',
		lg: 'h-10 w-10',
		xl: 'h-16 w-16',
	};
	protected colors = {
		white: 'stroke-white',
		neutral: 'stroke-neutral-300 dark:stroke-neutral-600',
		dongs: 'stroke-dongs-500 dark:stroke-dongs-600',
	};
}
