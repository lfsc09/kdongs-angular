import { delay, Observable, of, throwError } from 'rxjs';
import { LoginUserRequest, LoginUserResponse } from '../app/infra/gateways/authentication/authentication-gateway.model';
import { Faker } from './_default-faker';
import { AuthenticationFakerData } from './authentication-faker.data';

export class AuthenticationFaker extends Faker {
	static loginUser(request: LoginUserRequest, failRequest?: boolean): Observable<LoginUserResponse> {
		const generateRandomness = this.randomVariables();
		// Fail the Request
		if ((failRequest !== undefined && failRequest) || generateRandomness.failRequest) {
			return throwError(() => new Error('Request Failed')).pipe(delay(generateRandomness.requestTime));
		}
		return of(AuthenticationFakerData.getUser(request?.email ?? '', request?.password ?? '')).pipe(delay(generateRandomness.requestTime));
	}
}
