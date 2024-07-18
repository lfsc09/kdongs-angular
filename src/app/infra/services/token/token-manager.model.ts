export interface TokenData {
	userId: string;
	username: string;
	name: string;
	perms: { [key: string]: boolean };
	configs: string;
	host: string;
	iat: number;
	exp?: number;
}
