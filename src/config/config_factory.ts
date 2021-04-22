import { ConfigFactory } from '@nestjs/config';
import dotenv from 'dotenv';

import { validateConfig } from './config_validator';
import { APP_HOST, APP_PORT, DB_CONFIG } from './keys';
import { IAppConfig } from './typings';

export const configFactory: ConfigFactory<IAppConfig> = () => {
    const {error, parsed} = dotenv.config();
    if (error !== undefined || parsed === undefined) {
        throw error;
    }

    const config: IAppConfig = {
        [APP_HOST]: parsed.APP_HOST,
        [APP_PORT]: Number(parsed.APP_PORT),
        [DB_CONFIG]: {
            database: parsed.DB_NAME,
            host: parsed.DB_HOST,
            logging: parsed.DB_LOG === 'true',
            password: parsed.DB_PASS,
            port: Number(parsed.DB_PORT),
            type: parsed.DB_TYPE,
            username: parsed.DB_USER,
        },
    };

    validateConfig(config);

    return config;
};