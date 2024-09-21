import { RunResponse } from "../app/infra/gateways/authentication/authentication-gateway.model";

interface User {
	email: string;
	password: string;
	/**
	 * {
	 *      id: string;
	 *      email: string;
	 *      name: string;
	 *      perms: { [key: PERM_ID]: boolean };
	 *      configs: {};
	 *      host: string;
	 * }
	 */
	token: string;
}

export class AuthenticationFaker {
	private static users: User[] = [
		{
			email: 'jacinto.pinto@gmail.com',
			password: '123456',
			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3Yzc1ZWIyNS1iYzk5LTQxNWItYmU1YS1jOTdkYjZkYTY5MjgiLCJ1c2VyRW1haWwiOiJqYWNpbnRvLnBpbnRvQGdtYWlsLmNvbSIsInVzZXJGdWxsbmFtZSI6IkphY2ludG8gUGludG8iLCJwZXJtcyI6eyJVU0VSU19BQ0NFU1MiOnRydWUsIlVTRVJTX05FVyI6dHJ1ZSwiVVNFUlNfRURJVCI6dHJ1ZSwiVVNFUlNfU0RFTCI6dHJ1ZSwiSU5WRVNUTUVOVFNfQUNDRVNTIjp0cnVlLCJJTlZFU1RNRU5UU19ORVciOnRydWUsIklOVkVTVE1FTlRTX0VESVQiOnRydWUsIklOVkVTVE1FTlRTX0hERUwiOnRydWUsIkVYUEVOU0VTX0FDQ0VTUyI6dHJ1ZSwiRVhQRU5TRVNfTkVXIjp0cnVlLCJFWFBFTlNFU19FRElUIjp0cnVlLCJFWFBFTlNFU19IREVMIjp0cnVlfSwiaG9zdCI6Imtkb25ncyIsImlhdCI6NDUxNjIzOTAyMn0.BEuJ2myqC3C20VsHCe7zRHp5lKCvm39vv1nD2d2tH6w',
		},
		{
			email: 'tomas.turbando@gmail.com',
			password: '123456',
			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NDA4Y2RjZC02YTc3LTQ1MzMtYjZkMy00ODE5MDRiNDY3YjIiLCJ1c2VyRW1haWwiOiJ0b21hcy50dXJiYW5kb0BnbWFpbC5jb20iLCJ1c2VyRnVsbG5hbWUiOiJUb21hcyBUdXJiYW5kbyIsInBlcm1zIjp7IlVTRVJTX0FDQ0VTUyI6ZmFsc2UsIlVTRVJTX05FVyI6ZmFsc2UsIlVTRVJTX0VESVQiOmZhbHNlLCJVU0VSU19TREVMIjpmYWxzZSwiSU5WRVNUTUVOVFNfQUNDRVNTIjpmYWxzZSwiSU5WRVNUTUVOVFNfTkVXIjpmYWxzZSwiSU5WRVNUTUVOVFNfRURJVCI6ZmFsc2UsIklOVkVTVE1FTlRTX0hERUwiOmZhbHNlLCJFWFBFTlNFU19BQ0NFU1MiOnRydWUsIkVYUEVOU0VTX05FVyI6dHJ1ZSwiRVhQRU5TRVNfRURJVCI6dHJ1ZSwiRVhQRU5TRVNfSERFTCI6dHJ1ZX0sImhvc3QiOiJrZG9uZ3MiLCJpYXQiOjQ1MTYyMzkwMjJ9.3lKHk6NMkE9OigG62GLx4Q2tseWC8vq5FFtLAIqHrK0',
		},
	];
	private static requestFakeTime: number = 1300;

	private static fakeFailRequest(): boolean {
		return Math.trunc(Math.random() * 10) > 8;
	}

	static findUserByEmailAndPassword(email: string | null | undefined, password: string | null | undefined): Promise<RunResponse> {
		let user = this.users.find((user) => email === user.email && password === user.password);
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (this.fakeFailRequest()) reject(new Error('Request Failed'));
				else resolve(user?.token || null);
			}, this.requestFakeTime);
		});
	}
}
