export const environment = {
    title: 'Kdongs',
	token: {
		host: 'kdongs',
        // lifespan of "1d" (miliseconds)
		lifespan: 60 * 60 * 24 * 1000,
		// re-process token interval each "5min" (miliseconds)
		interval: 300000,
	},
};
