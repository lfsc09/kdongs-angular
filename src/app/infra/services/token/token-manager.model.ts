export interface TokenData {
    userId: string;
    username: string;
    name: string;
    admin_flag: boolean;
    perms: string;
    configs: string;
    host: string;
    iat: number;
    exp?: number;
}