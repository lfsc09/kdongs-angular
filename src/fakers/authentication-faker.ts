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
			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdjNzVlYjI1LWJjOTktNDE1Yi1iZTVhLWM5N2RiNmRhNjkyOCIsInVzZXJuYW1lIjoiamFjaW50by5waW50byIsIm5hbWUiOiJKYWNpbnRvIFBpbnRvIiwicGVybXMiOnsiVVNFUlNfQUNDRVNTIjp0cnVlLCJVU0VSU19SRUdJU1RFUiI6dHJ1ZSwiVVNFUlNfRURJVCI6dHJ1ZSwiVVNFUlNfU0RFTCI6dHJ1ZSwiSU5WRVNUTUVOVFNfQUNDRVNTIjp0cnVlLCJJTlZFU1RNRU5UU19SRUdJU1RFUiI6dHJ1ZSwiSU5WRVNUTUVOVFNfRURJVCI6dHJ1ZSwiSU5WRVNUTUVOVFNfSERFTCI6dHJ1ZSwiRVhQRU5TRVNfQUNDRVNTIjp0cnVlLCJFWFBFTlNFU19SRUdJU1RSQVRJT04iOnRydWUsIkVYUEVOU0VTX0VESVQiOnRydWUsIkVYUEVOU0VTX0hERUwiOnRydWV9LCJob3N0Ijoia2RvbmdzIiwiaWF0Ijo0NTE2MjM5MDIyfQ.6zSi31-JN-KPgfzutfETiMvA-IoQwiq1wTUN7oyijRw',
		},
		{
			username: 'tomas.turbando',
			password: '123456',
			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0MDhjZGNkLTZhNzctNDUzMy1iNmQzLTQ4MTkwNGI0NjdiMiIsInVzZXJuYW1lIjoidG9tYXMudHVyYmFuZG8iLCJuYW1lIjoiVG9tYXMgVHVyYmFuZG8iLCJwZXJtcyI6eyJVU0VSU19BQ0NFU1MiOmZhbHNlLCJVU0VSU19SRUdJU1RFUiI6ZmFsc2UsIlVTRVJTX0VESVQiOmZhbHNlLCJVU0VSU19TREVMIjpmYWxzZSwiSU5WRVNUTUVOVFNfQUNDRVNTIjpmYWxzZSwiSU5WRVNUTUVOVFNfUkVHSVNURVIiOmZhbHNlLCJJTlZFU1RNRU5UU19FRElUIjpmYWxzZSwiSU5WRVNUTUVOVFNfSERFTCI6ZmFsc2UsIkVYUEVOU0VTX0FDQ0VTUyI6dHJ1ZSwiRVhQRU5TRVNfUkVHSVNUUkFUSU9OIjp0cnVlLCJFWFBFTlNFU19FRElUIjp0cnVlLCJFWFBFTlNFU19IREVMIjp0cnVlfSwiaG9zdCI6Imtkb25ncyIsImlhdCI6NDUxNjIzOTAyMn0.7n0492l1Qe_Cb_81DUHId--HCqLsbCrf4CQOfdpw2EE',
		},
	];
	private static requestFakeTime: number = 1300;

	private static fakeFailRequest(): boolean {
		return Math.trunc(Math.random() * 10) > 8;
	}

	static findUserByEmailAndPassword(username: string | null | undefined, password: string | null | undefined): Promise<string | null> {
		let user = this.users.find((user) => username === user.username && password === user.password);
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (this.fakeFailRequest()) reject(new Error('Request Failed'));
				else resolve(user?.token || null);
			}, this.requestFakeTime);
		});
	}
}
