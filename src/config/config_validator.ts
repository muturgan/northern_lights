import Validator, { SyncCheckFunction, ValidationSchema } from 'fastest-validator';

import { IAppConfig } from './typings';

const v = new Validator();

const schema: ValidationSchema<IAppConfig> = {
    APP_HOST: 'string',
    APP_PORT: { type: 'number', positive: true, integer: true },
    ADMIN_PASS: 'string',
    DB_CONFIG: {
        $$type: 'object',
        type: 'string',
        host: 'string',
        port: { type: 'number', positive: true, integer: true },
        username: 'string',
        password: 'string',
        database: 'string',
        synchronize: 'boolean',
        logging: 'boolean',
        timezone: 'string',
    },
};

const check = v.compile(schema) as SyncCheckFunction;

export function validateConfig(config: Record<string, any>): config is IAppConfig {
    const result = check(config);
    if (result !== true) {
        const message = result.map((er) => er.message).join('; ');
        throw new Error('App config validation failed: ' + message);
    }
    return result;
}