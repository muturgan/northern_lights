import { ConfigModuleOptions } from '@nestjs/config';

import { configFactory } from './config_factory';

export const configOptions: ConfigModuleOptions = {
   ignoreEnvFile: true,
   ignoreEnvVars: true,
   load: [configFactory],
};