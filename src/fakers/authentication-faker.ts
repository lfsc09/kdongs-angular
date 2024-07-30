import { RunResponse } from "../app/infra/gateways/authentication/authentication-gateway.model";

interface User {
	username: string;
	password: string;
	/**
	 * {
	 *      id: string;
	 *      username: string;
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
			username: 'jacinto.pinto',
			password: '123456',
			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3Yzc1ZWIyNS1iYzk5LTQxNWItYmU1YS1jOTdkYjZkYTY5MjgiLCJ1c2VyVXNlcm5hbWUiOiJqYWNpbnRvLnBpbnRvIiwidXNlckZ1bGxuYW1lIjoiSmFjaW50byBQaW50byIsInBlcm1zIjp7IlVTRVJTX0FDQ0VTUyI6dHJ1ZSwiVVNFUlNfTkVXIjp0cnVlLCJVU0VSU19FRElUIjp0cnVlLCJVU0VSU19TREVMIjp0cnVlLCJJTlZFU1RNRU5UU19BQ0NFU1MiOnRydWUsIklOVkVTVE1FTlRTX05FVyI6dHJ1ZSwiSU5WRVNUTUVOVFNfRURJVCI6dHJ1ZSwiSU5WRVNUTUVOVFNfSERFTCI6dHJ1ZSwiRVhQRU5TRVNfQUNDRVNTIjp0cnVlLCJFWFBFTlNFU19ORVciOnRydWUsIkVYUEVOU0VTX0VESVQiOnRydWUsIkVYUEVOU0VTX0hERUwiOnRydWV9LCJob3N0Ijoia2RvbmdzIiwiaWF0Ijo0NTE2MjM5MDIyfQ.JonsbF-LoyrUwftwTS_bBqSOjDHFXTvb3YtK0LRlWpc',
		},
		{
			username: 'tomas.turbando',
			password: '123456',
			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NDA4Y2RjZC02YTc3LTQ1MzMtYjZkMy00ODE5MDRiNDY3YjIiLCJ1c2VyVXNlcm5hbWUiOiJ0b21hcy50dXJiYW5kbyIsInVzZXJGdWxsbmFtZSI6IlRvbWFzIFR1cmJhbmRvIiwicGVybXMiOnsiVVNFUlNfQUNDRVNTIjpmYWxzZSwiVVNFUlNfTkVXIjpmYWxzZSwiVVNFUlNfRURJVCI6ZmFsc2UsIlVTRVJTX1NERUwiOmZhbHNlLCJJTlZFU1RNRU5UU19BQ0NFU1MiOmZhbHNlLCJJTlZFU1RNRU5UU19ORVciOmZhbHNlLCJJTlZFU1RNRU5UU19FRElUIjpmYWxzZSwiSU5WRVNUTUVOVFNfSERFTCI6ZmFsc2UsIkVYUEVOU0VTX0FDQ0VTUyI6dHJ1ZSwiRVhQRU5TRVNfTkVXIjp0cnVlLCJFWFBFTlNFU19FRElUIjp0cnVlLCJFWFBFTlNFU19IREVMIjp0cnVlfSwiaG9zdCI6Imtkb25ncyIsImlhdCI6NDUxNjIzOTAyMn0.CG1oYljiKWepsMGa1AlNACgs3j1jfMGSQQj1JztTkDo',
		},
	];
	private static requestFakeTime: number = 1300;

	private static fakeFailRequest(): boolean {
		return Math.trunc(Math.random() * 10) > 8;
	}

	static findUserByEmailAndPassword(username: string | null | undefined, password: string | null | undefined): Promise<RunResponse> {
		let user = this.users.find((user) => username === user.username && password === user.password);
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (this.fakeFailRequest()) reject(new Error('Request Failed'));
				else resolve(user?.token || null);
			}, this.requestFakeTime);
		});
	}
}
