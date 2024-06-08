/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "selector",
	content: ["./src/**/*.{html,ts}"],
	theme: {
		screens: {
			"mobile-v": "480px",
			"mobile-h": "768px",
			"tablet-v": "834px",
			"tablet-h": "1024px",
			laptop: "1440px",
			"desktop-1k": "1920px",
			"desktop-2k": "2560px",
		},
		container: {
			center: true,
			// padding: '2rem',
		},
		extend: {},
	},
	plugins: [],
};
