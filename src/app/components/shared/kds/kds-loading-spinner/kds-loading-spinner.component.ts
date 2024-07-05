import { Component, input } from '@angular/core';

@Component({
	selector: 'kds-loading-spinner',
	standalone: true,
	imports: [],
	template: `
		<div class="flex transition-opacity delay-150 ease-in-out">
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
		</div>
	`,
})
export class KdsLoadingSpinnerComponent {
    /**
     * SIGNALS
     */
	size = input<'sm' | 'md' | 'lg'>('sm');
	position = input<'start' | 'center' | 'end'>('center');
	color = input<'white' | 'dongs'>('white');

    /**
     * VARS
     */
	protected sizes = {
		sm: 'h-4 w-4',
		md: 'h-6 w-6',
		lg: 'h-10 w-10',
	};
	protected colors = {
		white: 'stroke-white',
		dongs: 'stroke-dongs-500',
	};
}
