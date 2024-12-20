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
				'kds-loading-circular-progress': {
					'0%': {
						transform: 'rotate(0deg)',
					},
					'100%': {
						transform: 'rotate(360deg)',
					},
				},
				'kds-loading-circular-linear': {
					'0%': {
						'stroke-dasharray': '1px, 200px',
						'stroke-dashoffset': '0',
					},
					'50%': {
						'stroke-dasharray': '100px, 200px',
						'stroke-dashoffset': '-15px',
					},
					'100%': {
						'stroke-dasharray': '100px, 200px',
						'stroke-dashoffset': '-125px',
					},
				},
			},
			animation: {
				'kds-go': 'kds-go-around 2s infinite',
				'kds-loading-circular-outer': '1.4s linear 0s infinite normal none running kds-loading-circular-progress',
				'kds-loading-circular-inner': '1.4s ease-in-out 0s infinite normal none running kds-loading-circular-linear',
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

				/**************
				 * BLOCK QUOTE
				 **************/
				'.kds-blockquote': {
					'@apply text-sm font-medium mt-4 border-l-4 border-l-blue-400 pl-6 italic': {},
				},

				/******************
				 * LOADING SPINNER
				 ******************/
				'.kds-loading-spinner-outer': {
					'@apply inline-block animate-kds-loading-circular-outer': {},
				},
				'.kds-loading-spinner-inner': {
					'@apply stroke-current animate-kds-loading-circular-inner': {},
					'stroke-dasharray': '80px, 200px',
					'stroke-dashoffset': '0',
				},

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
				 * FORMS
				 ********/

				// Form group vertically
				'.kds-form-group-v': {
					'@apply flex flex-col gap-1 text-sm': {},

					'& > label': {
						'@apply block font-bold select-none': {},
					},

					'& > .kds-form-group-error': {
						'@apply text-red-500 dark:text-red-400 text-[.75rem] select-none': {},
					},
				},

				/********
				 * INPUT
				 ********/

				// Inputs/Textareas Invalid
				'input.kds-input.kds-input-error, textarea.kds-textarea.kds-textarea-erro': {
					'@apply ring-1 ring-offset-0 ring-red-300 dark:ring-red-300/60': {},
				},

				// General Inputs [NOT checkbox] [NOT time]
				'input:not([type="checkbox"]).kds-input, input:not([type="time"]).kds-input': {
					'@apply border rounded py-2 px-3 dark:bg-neutral-900 dark:border-neutral-900': {},

					// Input small size
					'&.kds-input-sm': {
						'@apply leading-tight': {},
					},

					// Input extra small size
					'&.kds-input-xs': {
						'@apply leading-none': {},
					},
				},

				// Selects
				'.kds-select': {
					'@apply relative': {},

					'&:before': {
						'@apply content-[""] pointer-events-none absolute right-4 top-1/2 border-l-[.3rem] border-l-transparent border-r-[.3rem] border-r-transparent border-t-[.3rem] border-t-neutral-900 dark:border-t-neutral-50':
							{},
					},

					'& > select': {
						'@apply appearance-none w-full border rounded py-2 px-3 dark:bg-neutral-900 dark:border-neutral-900': {},
					},

					// Input small size
					'&.kds-select-sm > select': {
						'@apply leading-tight': {},
					},

					// Input extra small size
					'&.kds-select-xs > select': {
						'@apply leading-none': {},
					},
				},

				// Text Areas
				'textarea.kds-textarea': {
					'@apply border rounded py-2 px-3 dark:bg-neutral-900 dark:border-neutral-900': {},

					// Input small size
					'&.kds-textarea-sm': {
						'@apply leading-tight': {},
					},

					// Input extra small size
					'&.kds-textarea-xs': {
						'@apply leading-none': {},
					},
				},

				// Checkbox wrapper
				'div.kds-input-checkbox-wrapper': {
					'@apply flex items-center': {},

					// Inputs Checkbox
					'& > input[type="checkbox"].kds-input-checkbox': {
						'@apply w-4 h-4 rounded ': {},
					},
					'& > label': {
						'@apply ms-2 text-=sm font-medium': {},
					},
				},

				// Inputs Checkbox (Tootle Button Style)

				// Input Time
				'input[type="time"]': {
					'@apply p-4': {},
				},

				/********
				 * BADGE
				 ********/
				'.kds-badge': {
					'@apply w-fit px-3 py-2 text-sm font-semibold text-slate-700 rounded-sm select-none bg-gray-200;': {},

					// Badge small size
					'&.kds-badge-sm': {
						'@apply !px-2 !py-1': {},
					},
				},

				/************
				 * SEPARATOR
				 ************/

				// Horizontal divider
				'hr.kds-h-divider': {
					'@apply my-4 h-0.5 border-t-0 bg-transparent bg-gradient-to-r from-transparent to-current opacity-75': {},
				},
				'hr.kds-h-divider-inverted': {
					'@apply my-4 h-0.5 border-t-0 bg-transparent bg-gradient-to-l from-transparent to-current opacity-75': {},
				},

				// Horizontal divider with text
				'div.kds-h-divider-text': {
					'@apply h-3 border-b-2 border-current text-center': {},

					// With text
					'& > span': {
						'@apply bg-transparent px-5': {},
					},
				},
			});
		},
	],
};
