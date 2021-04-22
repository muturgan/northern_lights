export interface IAppConfig {
    readonly APP_HOST: string;
    readonly APP_PORT: number;
    readonly DB_CONFIG: {
        readonly database: string;
        readonly host: string;
        readonly logging: boolean;
        readonly password: string;
        readonly port: number;
        readonly type: string;
        readonly username: string;
    };
}