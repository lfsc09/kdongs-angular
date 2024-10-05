import { Signal } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * GATEWAY DEFINITION
 */
export interface IAuthenticationGatewayService {
	loading: Signal<boolean>;
	loginUser(request: LoginUserRequest): Observable<LoginUserResponse>;
}

/**
 * GATEWAY METHODS
 */
export type LoginUserRequest = {
	email: string | null | undefined;
	password: string | null | undefined;
};
export type LoginUserResponse = IToken | null;

export type IToken = string;
