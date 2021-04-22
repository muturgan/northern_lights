import { ConfigFactory } from '@nestjs/config';
import dotenv from 'dotenv';
import { IAppConfig } from './typings';

export const configFactory: ConfigFactory<IAppConfig> = () => {
    const {error, parsed} = dotenv.config();
    if (error !== undefined || parsed === undefined) {
        throw error;
    }

    return {
        APP_HOST: parsed.APP_HOST,
        APP_PORT: parsed.APP_PORT,
    };
};