import { ConfigModuleOptions } from '@nestjs/config';
import { configFactory } from './config_factory';
import { validateConfig } from './config_validator';

export const configOptions: ConfigModuleOptions = {
    ignoreEnvFile: true,
    load: [configFactory],
    validate: validateConfig,
};