import { AuthenticationGatewayFakeService } from '../app/infra/gateways/authentication/authentication-gateway-fake.service';
import { InvestmentsGatewayFakeService } from '../app/infra/gateways/investments/investments-gateway-fake.service';

export const environment = {
	production: false,
	title: 'Kdongs',
	host: 'kdongs',
	token: {
		// lifespan of "1d" (miliseconds)
		lifespan: 60 * 60 * 24 * 1000,
		// re-process token interval (miliseconds)
		interval: 5000,
	},
	investmentsGatewayService: InvestmentsGatewayFakeService,
	authenticationGatewayService: AuthenticationGatewayFakeService,
};
