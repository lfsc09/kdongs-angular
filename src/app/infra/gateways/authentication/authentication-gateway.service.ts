import { Injectable, signal, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthenticationGatewayService, LoginUserRequest, LoginUserResponse } from './authentication-gateway.model';

@Injectable()
export class AuthenticationGatewayService implements IAuthenticationGatewayService {
	private _loading = signal<boolean>(false);
	loading: Signal<boolean> = this._loading.asReadonly();

	loginUser(request: LoginUserRequest): Observable<LoginUserResponse> {
		throw new Error('Method not implemented.');
	}
}
