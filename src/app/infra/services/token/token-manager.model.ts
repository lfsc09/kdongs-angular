export interface TokenData {
	userId: string;
	userEmail: string;
	userFullname: string;
	perms: { [key: string]: boolean };
	configs: string;
	host: string;
    tz: string;
	iat: number;
	exp?: number;
}
