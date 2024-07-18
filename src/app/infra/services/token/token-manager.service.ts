import { Injectable, signal } from '@angular/core';
import { addDays } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenData } from './token-manager.model';

@Injectable({
	providedIn: 'root',
})
export class TokenManagerService {
    /**
     * SIGNALS AND OBSERVABLES
     */
	private _token = signal<string | null>(null);
	private _tokenData = signal<TokenData | null>(null);
	// In miliseconds
	private _tokenExpLeft$: BehaviorSubject<number> = new BehaviorSubject(0);

    token = this._token.asReadonly();
    tokenData = this._tokenData.asReadonly();
	tokenExpLeft$ = this._tokenExpLeft$.asObservable();

	/**
	 * FUNCTIONS
	 */
	processToken(token: string | null = null): boolean {
		// In-memory token
		if (token === null && this._tokenData() !== null) {
			if (this.isValid(this._tokenData() as TokenData)) {
				this._tokenExpLeft$.next(this.calculateTokenExpLeft());
				return true;
			} else {
				this.clear();
				return false;
			}
		}

		const tokenRead = token === null ? localStorage.getItem(`token:${environment.token.host}`) : token;
		this._tokenData.set(this.extractToken(tokenRead));

		if (this._tokenData() !== null && tokenRead !== null) {
			// Only save in localStorage if token is from login
			if (token !== null) localStorage.setItem(`token:${environment.token.host}`, tokenRead as string);
			this._token.set(tokenRead);
			this._tokenExpLeft$.next(this.calculateTokenExpLeft());
			return true;
		} else if (tokenRead !== null) this.clear();
		return false;
	}

	clear(): void {
		this._token.set(null);
		this._tokenData.set(null);
		this._tokenExpLeft$.next(0);
		localStorage.removeItem(`token:${environment.token.host}`);
	}

	private calculateTokenExpLeft(): number {
		if (this._tokenData()) {
			const expLeft = (this._tokenData()!.exp ?? 0) * 1000 - new Date().getTime();
			return expLeft > 0 ? expLeft : 0;
		}
		return 0;
	}

	private extractToken(token: string | null): TokenData | null {
		try {
			const decodedToken = this.decode(token);

			// If `exp` was not defined in the server
			// TODO: Delete this later
			if (decodedToken && decodedToken?.exp === undefined) {
				const newExp = addDays(new Date(), 1);
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
			if (tokenData.host === environment.token.host && tokenExpDate >= new Date()) return true;
		}
		return false;
	}

	/**
	 * Using jwt-decode.
	 */
	private decode(token: string | null): TokenData | null {
		return jwtDecode<TokenData | null>(token ?? '');
	}
}
