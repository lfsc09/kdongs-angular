import { InvestmentsGatewayService } from '../app/infra/gateways/investments/investments-gateway.service';

export const environment = {
	production: true,
	title: 'Kdongs',
	token: {
		host: 'kdongs',
		// lifespan of "1d" (miliseconds)
		lifespan: 60 * 60 * 24 * 1000,
		// re-process token interval each "5min" (miliseconds)
		interval: 300000,
	},
	investmentsGatewayService: InvestmentsGatewayService,
};
