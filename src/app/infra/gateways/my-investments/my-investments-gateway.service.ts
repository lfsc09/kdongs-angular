import { Injectable } from '@angular/core';
import { InvestmentsFaker } from '../../../../fakers/investments-faker';
import { GetWalletsResponse } from './my-investments-gateway.model';

@Injectable()
export class MyInvestmentsGatewayService {
	async getWalletsFake(): Promise<GetWalletsResponse> {
		try {
			const response = await InvestmentsFaker.getWallets();
			if (response) return response;
			else console.warn('showLogError for invalid response');
		} catch (err: any) {
			// TODO: Make service for LogManagement
			console.error(err.message);
		}
		return null;
	}
}
