import { Injectable } from '@angular/core';
import { addHours } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import { TokenData } from './token-manager.model';

@Injectable({
	providedIn: 'root',
})
export class TokenManagerService {
	private _token: string | null = null;
	private _tokenData: TokenData | null = null;

	constructor() {}

	get token(): string | null {
		return this._token;
	}

	get tokenData(): TokenData | null {
		return this._tokenData;
	}

	processToken(token: string | null = null): boolean {
		if (token === null && this._tokenData !== null && this.isValid(this._tokenData)) return true;

		const tokenRead = token === null ? localStorage.getItem('token:kdongs') : token;
		this._tokenData = this.extractToken(tokenRead);
        
		if (this._tokenData !== null) {
			// Only save in localStorage if token is from login
			if (token !== null && tokenRead !== null) localStorage.setItem('token:kdongs', tokenRead);
			this._token = tokenRead;
			return true;
		} else {
			this.clear();
			return false;
		}
	}

	clear(): void {
		this._token = null;
		this._tokenData = null;
		localStorage.removeItem('token:kdongs');
	}

	private extractToken(token: string | null): TokenData | null {
		try {
			const decodedToken = this.decode(token);

            // If `exp` was not defined in the server
            // TODO: Delete this later
            if (decodedToken && decodedToken?.exp === undefined) {
                const newExp = addHours(new Date(), 4);
                decodedToken.exp = newExp.getTime() / 1000;
            }

			if (decodedToken && this.isValid(decodedToken)) return decodedToken;
			else throw new Error('Invalid token');
		} catch (err: any) {
			console.log('(JWT): Invalid token');
			return null;
		}
	}

	/**
	 * Check if the token is valid based on the `expireIn` => `exp` of the token and also the hostname.
	 */
	private isValid(tokenData: TokenData): boolean {
		if (tokenData) {
			// Generated token on server creates `exp` in seconds and must convert to miliseconds
			const tokenExpDate = new Date(tokenData.exp! * 1000);
			// TODO: Put host in ENV variables
			if (tokenData.host === 'kdongs' && tokenExpDate >= new Date()) return true;
		}
		return false;
	}

	/**
	 * Using jwt-decode.
	 */
	private decode(token: string | null): TokenData | null {
		return jwtDecode(token ?? '');
	}
}
