import { inject, Injectable } from '@angular/core';
import { AuthenticationFaker } from '../../../../fakers/authentication-faker';
import { TokenManagerService } from '../../services/token/token-manager.service';
import { RunResponse } from './authentication-gateway.model';

@Injectable()
export class AuthenticationGatewayService {
	private readonly tokenManagerService = inject(TokenManagerService);

	async runFake(username: string | null | undefined, password: string | null | undefined): Promise<'accept' | 'deny' | 'error'> {
		try {
			const token: RunResponse = await AuthenticationFaker.findUserByEmailAndPassword(username, password);
			if (token) {
				if (this.tokenManagerService.processToken(token)) return 'accept';
				else {
					console.warn('showLogError on invalid token');
					return 'deny';
				}
			} else {
				console.warn('showLogError for invalid user data');
				return 'deny';
			}
		} catch (err: any) {
			// TODO: Make service for LogManagement
			console.error(err.message);
		}
		return 'error';
	}
}
