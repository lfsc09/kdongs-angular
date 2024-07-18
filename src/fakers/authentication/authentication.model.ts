export interface User {
    id: string;
    username: string;
    name: string;
    password: string;
    /**
     * {
     *      id: string;
     *      username: string;
     *      name: string;
     *      admin_flag: boolean;
     *      perms: string;
     *      configs: object;
     *      host: string;
     * }
     */
    token: string;
    /**
     * {
     *      title: string;
     *      icon: string;
     *      url: string;
     * }
     */
    mods: string;
}