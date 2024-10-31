import { Component, input } from '@angular/core';

@Component({
	selector: 'kds-loading-infinite',
	standalone: true,
	imports: [],
	styles: `
		:host {
			@apply flex transition-opacity delay-150 ease-in-out;
		}
	`,
	template: `
		<span class="{{ sizes[size()] }}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 300 150"
			>
				<path
					class="{{ colors[color()] }}"
					fill="none"
					stroke-width="10"
					stroke-linecap="round"
					stroke-dasharray="300 385"
					d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
				>
					<animate
						attributeName="stroke-dashoffset"
						calcMode="spline"
						dur="3"
						values="685;-685"
						keySplines="0 0 1 1"
						repeatCount="indefinite"
					/>
				</path>
			</svg>
		</span>
	`,
})
export class KdsLoadingInfiniteComponent {
	/**
	 * SIGNALS
	 */
	size = input<'sm' | 'md' | 'lg'>('md');
	color = input<'neutral' | 'dongs'>('neutral');

	/**
	 * VARS
	 */
	protected sizes = {
		sm: 'h-10 w-10',
		md: 'h-20 w-20',
		lg: 'h-32 w-32',
	};
	protected colors = {
		neutral: 'stroke-neutral-300 dark:stroke-neutral-600',
		dongs: 'stroke-dongs-300 dark:stroke-dongs-600',
	};
}
