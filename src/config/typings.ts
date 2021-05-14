export interface IAppConfig {
    readonly APP_HOST: string;
    readonly APP_PORT: number;
    readonly ADMIN_PASS: string;
    readonly DB_CONFIG: {
        readonly type: string;
        readonly host: string;
        readonly port: number;
        readonly username: string;
        readonly password: string;
        readonly database: string;
        readonly synchronize: boolean;
        readonly logging: boolean;
        readonly timezone: string;
    };
}