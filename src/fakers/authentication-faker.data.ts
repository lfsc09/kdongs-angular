import { IToken } from '../app/infra/gateways/authentication/authentication-gateway.model';

interface User {
	email: string;
	password: string;
	/**
	 * {
	 *      userId: string;
	 *      userEmail: string;
	 *      userFullname: string;
	 *      perms: { [key: PERM_ID]: boolean };
	 *      host: string;
     *      tz (timezone): string;
	 * }
	 */
	token: string;
}

export class AuthenticationFakerData {
	private static readonly users: User[] = [
		{
			email: 'jacinto.pinto@gmail.com',
			password: '123456',
			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3Yzc1ZWIyNS1iYzk5LTQxNWItYmU1YS1jOTdkYjZkYTY5MjgiLCJ1c2VyRW1haWwiOiJqYWNpbnRvLnBpbnRvQGdtYWlsLmNvbSIsInVzZXJGdWxsbmFtZSI6IkphY2ludG8gUGludG8iLCJwZXJtcyI6eyJVU0VSU19BQ0NFU1MiOnRydWUsIlVTRVJTX05FVyI6dHJ1ZSwiVVNFUlNfRURJVCI6dHJ1ZSwiVVNFUlNfU0RFTCI6dHJ1ZSwiSU5WRVNUTUVOVFNfQUNDRVNTIjp0cnVlLCJJTlZFU1RNRU5UU19ORVciOnRydWUsIklOVkVTVE1FTlRTX0VESVQiOnRydWUsIklOVkVTVE1FTlRTX0hERUwiOnRydWUsIkVYUEVOU0VTX0FDQ0VTUyI6dHJ1ZSwiRVhQRU5TRVNfTkVXIjp0cnVlLCJFWFBFTlNFU19FRElUIjp0cnVlLCJFWFBFTlNFU19IREVMIjp0cnVlfSwiaG9zdCI6Imtkb25ncyIsInR6IjoiLTAzOjAwIiwiaWF0Ijo0NTE2MjM5MDIyfQ._bTHHK_wah2rUVCwTvoQyzfaGLv2L4WXquiyBjY1Bik',
		},
		{
			email: 'tomas.turbando@gmail.com',
			password: '123456',
			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NDA4Y2RjZC02YTc3LTQ1MzMtYjZkMy00ODE5MDRiNDY3YjIiLCJ1c2VyRW1haWwiOiJ0b21hcy50dXJiYW5kb0BnbWFpbC5jb20iLCJ1c2VyRnVsbG5hbWUiOiJUb21hcyBUdXJiYW5kbyIsInBlcm1zIjp7IlVTRVJTX0FDQ0VTUyI6ZmFsc2UsIlVTRVJTX05FVyI6ZmFsc2UsIlVTRVJTX0VESVQiOmZhbHNlLCJVU0VSU19TREVMIjpmYWxzZSwiSU5WRVNUTUVOVFNfQUNDRVNTIjpmYWxzZSwiSU5WRVNUTUVOVFNfTkVXIjpmYWxzZSwiSU5WRVNUTUVOVFNfRURJVCI6ZmFsc2UsIklOVkVTVE1FTlRTX0hERUwiOmZhbHNlLCJFWFBFTlNFU19BQ0NFU1MiOnRydWUsIkVYUEVOU0VTX05FVyI6dHJ1ZSwiRVhQRU5TRVNfRURJVCI6dHJ1ZSwiRVhQRU5TRVNfSERFTCI6dHJ1ZX0sImhvc3QiOiJrZG9uZ3MiLCJ0eiI6Ii0wNzowMCIsImlhdCI6NDUxNjIzOTAyMn0.crjNYpvx82GSIMIT547L96ttmky9_FfdR9k_ZC1lcXM',
		},
	];

	static getUser(email: string, password: string): IToken | null {
		return this.users.find((user) => user.email === email && user.password === password)?.token ?? null;
	}
}
