import { ConfigFactory } from '@nestjs/config';
import path = require('path');

import { validateConfig } from './config_validator';
import { IAppConfig } from './typings';

export const configFactory: ConfigFactory<IAppConfig> = () => {
    const ormconfig = require(path.join(process.cwd(), 'ormconfig'));

    const config: IAppConfig = {
        APP_HOST: ormconfig.APP_HOST,
        APP_PORT: parseInt(ormconfig.APP_PORT, 10),
        ADMIN_PASS: ormconfig.ADMIN_PASS,
        DB_CONFIG: {
            type: ormconfig.type,
            host: ormconfig.host,
            port: ormconfig.port,
            username: ormconfig.username,
            password: ormconfig.password,
            database: ormconfig.database,
            synchronize: ormconfig.synchronize,
            logging: ormconfig.logging,
            timezone: ormconfig.timezone,
        },
    };

    validateConfig(config);

    return config;
};