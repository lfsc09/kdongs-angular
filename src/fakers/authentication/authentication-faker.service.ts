import { Injectable } from '@angular/core';
import { User } from './authentication.model';

@Injectable()
export class AuthenticationFakerService {
	private users: User[];
	requestTime: number = 1300;

	constructor() {
		this.users = [
			{
				id: '7c75eb25-bc99-415b-be5a-c97db6da6928',
				name: 'Jacinto Pinto',
				username: 'jacinto.pinto',
				password: '123456',
				token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdjNzVlYjI1LWJjOTktNDE1Yi1iZTVhLWM5N2RiNmRhNjkyOCIsIm5hbWUiOiJKYWNpbnRvIFBpbnRvIiwidXNlcm5hbWUiOiJqYWNpbnRvLnBpbnRvIiwiaG9zdCI6Imtkb25ncyIsImFkbWluX2ZsYWciOnRydWUsImlhdCI6NDUxNjIzOTAyMn0.81oWn-SEq3ZeqVYeb30u7KQOcMuIa_01Iwc9PXard7Y',
				mods: '',
			},
			{
                id: '7408cdcd-6a77-4533-b6d3-481904b467b2',
                name: 'Tomas Turbando',
                username: 'tomas.turbando',
                password: '654321',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0MDhjZGNkLTZhNzctNDUzMy1iNmQzLTQ4MTkwNGI0NjdiMiIsIm5hbWUiOiJUb21hcyBUdXJiYW5kbyIsInVzZXJuYW1lIjoidG9tYXMudHVyYmFuZG8iLCJob3N0Ijoia2RvbmdzIiwiYWRtaW5fZmxhZyI6ZmFsc2UsImlhdCI6NDUxNjIzOTAyMn0.g5Vl9J9LB7116ORU5K_G-BsXnEBtM-e3IHQFBwhwfbA',
                mods: ''
            },
		];
	}

	fakeFailRequest(): boolean {
		return Math.trunc(Math.random() * 10) > 8;
	}

	findUserByEmailAndPassword(username: string | null | undefined, password: string | null | undefined): Promise<string | null> {
		let user = this.users.find((user) => username === user.username && password === user.password);
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (this.fakeFailRequest()) reject(new Error('Request Failed'));
				else resolve(user?.token || null);
			}, this.requestTime);
		});
	}
}
