export interface TokenData {
    userId: string;
    username: string;
    user: string;
    admin_flag: boolean;
    perms: string;
    configs: string;
    host: string;
    iat: number;
    exp?: number;
}