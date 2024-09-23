import { Injectable } from '@angular/core';
import { InvestmentsFaker } from '../../../../fakers/investments-faker';
import { GetPerformanceRequest, GetPerformanceResponse, GetWalletsResponse } from './investments-gateway.model';

@Injectable()
export class InvestmentsGatewayService {
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

    async getPerformanceFake(request: GetPerformanceRequest): Promise<GetPerformanceResponse> {
        try {
			const response = await InvestmentsFaker.getPerformance();
			if (response) return response;
			else console.warn('showLogError for invalid response');
		} catch (err: any) {
			// TODO: Make service for LogManagement
			console.error(err.message);
		}
		return null;
    }
}
