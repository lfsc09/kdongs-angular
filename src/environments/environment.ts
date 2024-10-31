import { AuthenticationGatewayService } from '../app/infra/gateways/authentication/authentication-gateway.service';
import { InvestmentsGatewayService } from '../app/infra/gateways/investments/investments-gateway.service';

export const environment = {
	production: true,
	title: 'Kdongs',
    host: 'kdongs',
	token: {
		// lifespan of "1d" (miliseconds)
		lifespan: 60 * 60 * 24 * 1000,
		// re-process token interval each "5min" (miliseconds)
		interval: 300000,
	},
	investmentsGatewayService: InvestmentsGatewayService,
	authenticationGatewayService: AuthenticationGatewayService,
};
