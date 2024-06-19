import { Injectable } from '@angular/core';
import { User } from './authentication.model';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationFakerService {
	private users: User[];

	constructor() {
		this.users = [
			{
				id: '7c75eb25-bc99-415b-be5a-c97db6da6928',
				name: 'Jacinto Pinto',
				username: 'jacinto.pinto',
				password: '123456',
				token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdjNzVlYjI1LWJjOTktNDE1Yi1iZTVhLWM5N2RiNmRhNjkyOCIsIm5hbWUiOiJKYWNpbnRvIFBpbnRvIiwidXNlcm5hbWUiOiJqYWNpbnRvLnBpbnRvIiwiaWF0Ijo0NTE2MjM5MDIyfQ.OTURxK1eK3b0VsakCYLtCmpPwAMAVGxTPvA3choF1Jc',
			},
			{
				id: '7408cdcd-6a77-4533-b6d3-481904b467b2',
				name: 'Tomas Turbando',
				username: 'tomas.t',
				password: '654321',
				token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0MDhjZGNkLTZhNzctNDUzMy1iNmQzLTQ4MTkwNGI0NjdiMiIsIm5hbWUiOiJUb21hcyBUdXJiYW5kbyIsInVzZXJuYW1lIjoidG9tYXMudCIsImlhdCI6NDUxNjIzOTAyMn0.aczcQwun7rZ0K3W398yTRwCgIof2_nMzqphbr3EDdBs',
			},
		];
	}

	fakeFailRequest() {
		return Math.trunc(Math.random() * 10) > 8;
	}

	findUserByEmailAndPassword(username: string | null | undefined, password: string | null | undefined): Promise<string | null> {
		let user = this.users.find((user) => username === user.username && password === user.password);
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (this.fakeFailRequest()) reject(new Error('Request Failed'));
				else resolve(user?.token || null);
			}, 2500);
		});
	}
}
