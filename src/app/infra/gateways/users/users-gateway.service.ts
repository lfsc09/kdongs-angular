import { inject, Injectable } from '@angular/core';
import { UsersFaker } from '../../../../fakers/users-faker';
import { TokenManagerService } from '../../services/token/token-manager.service';
import { GetDatapoolRequest, GetDatapoolResponse } from './users-gateway.model';

@Injectable()
export class UsersGatewayService {
	private readonly tokenManagerService = inject(TokenManagerService);

	async getDatapoolFake(request: GetDatapoolRequest): Promise<GetDatapoolResponse> {
		try {
			const response = await UsersFaker.getDatapool(request);
			if (response) return response;
			else console.warn('showLogError for invalid response');
		} catch (err: any) {
			// TODO: Make service for LogManagement
			console.error(err.message);
		}
		return null;
	}
}
