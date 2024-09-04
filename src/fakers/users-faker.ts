import { GetUsersDatapoolRequest, GetUsersDatapoolResponse } from '../app/infra/gateways/users/users-gateway.model';

interface User {
	id: string;
    inactive_flag: boolean;
	admin_flag: boolean;
	username: string;
	name: string;
	email: string;
}

export class UsersFaker {
	private static users: User[] = [
		{
			id: '7c75eb25-bc99-415b-be5a-c97db6da6928',
            inactive_flag: false,
			admin_flag: true,
			username: 'jacinto.pinto',
			name: 'Jacinto Pinto',
			email: 'jacinto.p@gmail.com',
		},
		{
			id: '7408cdcd-6a77-4533-b6d3-481904b467b2',
            inactive_flag: false,
			admin_flag: false,
			username: 'tomas.turbando',
			name: 'Tomas Turbando',
			email: 't.turbando@gmail.com',
		},
		{ id: '1e670917-f513-4a6f-a97a-f884b8047171', inactive_flag: false, admin_flag: false, username: 'amcgennis0', name: 'Arleyne McGennis', email: 'amcgennis0@cam.ac.uk' },
		{ id: 'd3ef1ed7-e28f-4756-b221-d510f1c3d4c7', inactive_flag: false, admin_flag: false, username: 'gbellham1', name: 'Goldia Bellham', email: 'gbellham1@princeton.edu' },
		{ id: '4a51b5d4-1a5d-49ec-b623-6825258a07d3', inactive_flag: false, admin_flag: false, username: 'rmaceur2', name: 'Rochella Maceur', email: 'rmaceur2@yandex.ru' },
		{ id: '50d47ae3-c706-4666-8748-b8dc2aab3142', inactive_flag: false, admin_flag: false, username: 'tprout3', name: 'Tera Prout', email: 'tprout3@vistaprint.com' },
		{ id: '39150fc4-56c8-445e-8fa1-7339b0f430c4', inactive_flag: false, admin_flag: false, username: 'ekruschev4', name: 'Ezmeralda Kruschev', email: 'ekruschev4@wikispaces.com' },
		{ id: '2cfbef8f-61c8-4ec3-a0bc-71c2820a75a9', inactive_flag: false, admin_flag: false, username: 'vcyster5', name: 'Verena Cyster', email: 'vcyster5@blog.com' },
		{ id: 'd5ae6ee2-7404-4f99-bd4b-ceece7e6599d', inactive_flag: true, admin_flag: false, username: 'gcathrae6', name: 'Gavrielle Cathrae', email: 'gcathrae6@nps.gov' },
		{ id: '9a439f8b-c659-4fe8-89bb-5120171d734f', inactive_flag: false, admin_flag: false, username: 'amonteith7', name: 'Aldon Monteith', email: 'amonteith7@patch.com' },
		{ id: 'c50f3c57-67a6-4862-80f4-4e7f76f383ba', inactive_flag: false, admin_flag: false, username: 'ypendlington8', name: 'Yetty Pendlington', email: 'ypendlington8@biglobe.ne.jp' },
		{ id: '786e4928-5975-419a-8930-6db4e5e2309b', inactive_flag: false, admin_flag: false, username: 'rcescoti9', name: 'Rayna Cescoti', email: 'rcescoti9@alibaba.com' },
		{ id: '06dc11d2-b40a-472e-9b24-ef2494423e17', inactive_flag: false, admin_flag: false, username: 'davisona', name: 'Demetris Avison', email: 'davisona@lycos.com' },
		{ id: 'c944180e-f14b-4f16-acaf-107bcb3ac250', inactive_flag: false, admin_flag: false, username: 'lvedenisovb', name: 'Ly Vedenisov', email: 'lvedenisovb@newsvine.com' },
		{ id: 'eadd9ffe-16e2-49c5-87f8-45c703b320d7', inactive_flag: false, admin_flag: false, username: 'cdeightonc', name: 'Caryl Deighton', email: 'cdeightonc@elpais.com' },
		{ id: '23b135c7-7109-4051-84ff-a3bdc241cf7d', inactive_flag: true, admin_flag: false, username: 'scashfordd', name: 'Sherwin Cashford', email: 'scashfordd@google.ca' },
		{ id: 'f1e1c4c7-5244-4de3-8608-e00ae0f83305', inactive_flag: false, admin_flag: false, username: 'akennerknechte', name: 'Angelika Kennerknecht', email: 'akennerknechte@istockphoto.com' },
	];
    
	private static requestFakeTime: number = 1300;

	private static fakeFailRequest(): boolean {
		return Math.trunc(Math.random() * 10) > 8;
	}

	static getUsersDatapool(request: GetUsersDatapoolRequest): Promise<GetUsersDatapoolResponse> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (this.fakeFailRequest()) reject(new Error('Request Failed'));
				else {
					const startIndex = request.currPageIdx * request.itemsPerPage;
					const response: GetUsersDatapoolResponse = {
						pagePool: this.users.slice(startIndex, startIndex + request.itemsPerPage),
						pagesCount: Math.ceil(this.users.length / request.itemsPerPage),
						itemsCount: this.users.length,
						filteredItemsCount: this.users.length,
					};
					resolve(response);
				}
			}, this.requestFakeTime);
		});
	}
}
