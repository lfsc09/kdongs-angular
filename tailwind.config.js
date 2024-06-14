/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'selector',
	content: ['./src/**/*.{html,ts}'],
	theme: {
		screens: {
			'mobile-v': '480px',
			'mobile-h': '768px',
			'tablet-v': '834px',
			'tablet-h': '1024px',
			laptop: '1440px',
			'desktop-1k': '1920px',
			'desktop-2k': '2560px',
		},
		container: {
			center: true,
		},
		extend: {
			keyframes: {
				'kds-go-around': {
					'0%, 50%, 100%': {
						transform: 'translateX(0)',
						animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
					},
					'12%': {
						opacity: '0',
						transform: ' translateX(1rem)',
						animationTimingFunction: 'step-end',
					},
					'25%': {
						opacity: '1',
						transform: 'translateX(-1rem)',
					},
				},
			},
			animation: {
				'kds-go': 'kds-go-around 2s infinite',
			},
			fontFamily: {
				'kds-inter': ['KdsInter', 'ui-sans-serif', 'system-ui'],
				'kds-mono': ['KdsMono', 'ui-monospace'],
			},
			colors: {
				white: '#ffffff',
				dongs: {
					50: '#f0f9f4',
					100: '#dbf0e3',
					200: '#bae0cb',
					300: '#8cc9aa',
					400: '#5bac85',
					500: '#3d9970',
					600: '#287353',
					700: '#205c44',
					800: '#1c4937',
					900: '#183c2f',
					950: '#0c221a',
				},
			},
		},
	},
	plugins: [
		/** @type {import('tailwindcss/types/config').PluginCreator} */
		({ addComponents }) => {
			addComponents({
				/**
				 * KDS (Kdongs) Components in Tailwind
				 *
				 * Defined here to get auto-completion from the VScode.
				 *
				 */

				/*******************
				 * TITLE WITH SLASH
				 *******************/
				'.kds-title-slash': {
					'@apply relative pl-4 scroll-mt-32 select-none font-kds-mono': {},
				},
				'.kds-title-slash::before': {
					'@apply rounded-xl w-1 h-full block absolute left-0 bg-current content-[""]': {},
				},

				/*********
				 * BUTTON
				 *********/
				'button.kds-button': {
					'@apply py-2 px-4 rounded font-bold inline-flex justify-center items-center select-none': {},

					// Button size small
					'&.kds-button-sm': {
						'@apply text-sm py-1.5 px-2': {},
					},
				},

				/********
				 * INPUT
				 ********/

				// Form group vertically
				'.kds-form-group-v': {
					'@apply flex flex-col gap-1 text-sm': {},
					'& > label': {
						'@apply block font-bold select-none': {},
					},
				},

				// Form group horizontally

				//
				'input:not([type="checkbox"]).kds-input': {
					'@apply border rounded py-2 px-3 dark:text-slate-700': {},

					'&.kds-input-sm': {
						'@apply leading-tight': {},
					},
				},
			});
		},
	],
};
