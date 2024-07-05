export const environment = {
	token: {
		host: 'kdongs',
		// lifespan of "1d" (miliseconds)
		// lifespan: 60 * 60 * 24 * 1000,
		lifespan: 60 * 5 * 1000,
		// re-process token interval (miliseconds)
		interval: 5000,
	},
};
