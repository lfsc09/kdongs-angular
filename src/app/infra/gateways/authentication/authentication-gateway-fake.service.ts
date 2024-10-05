import { inject, Injectable, Signal, signal } from '@angular/core';
import { catchError, map, Observable, tap } from 'rxjs';
import { AuthenticationFaker } from '../../../../fakers/authentication-faker';
import { TokenManagerService } from '../../services/token/token-manager.service';
import { IAuthenticationGatewayService, LoginUserRequest } from './authentication-gateway.model';

@Injectable()
export class AuthenticationGatewayFakeService implements IAuthenticationGatewayService {
	private readonly tokenManagerService = inject(TokenManagerService);
	private _loading = signal<boolean>(false);
	loading: Signal<boolean> = this._loading.asReadonly();

	loginUser(request: LoginUserRequest): Observable<'accept' | 'deny'> {
		console.log('Faker Request: loginUser() with: ', request);
		this._loading.set(true);
		return AuthenticationFaker.loginUser(request).pipe(
			tap(() => this._loading.set(false)),
			map((response) => {
				if (this.tokenManagerService.processToken(response)) return 'accept';
				else {
					console.warn('Faker Response: loginUser() invalid token');
					return 'deny';
				}
			}),
			catchError((error) => {
				this._loading.set(false);
				throw error;
			}),
		);
	}
}
