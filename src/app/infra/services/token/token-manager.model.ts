export interface TokenData {
	userId: string;
	userUsername: string;
	userFullname: string;
	perms: { [key: string]: boolean };
	configs: string;
	host: string;
	iat: number;
	exp?: number;
}
