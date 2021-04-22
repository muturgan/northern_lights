import { plainToClass } from 'class-transformer';
import { IsIP, IsNotEmpty, IsNumber, IsNumberString, validateSync } from 'class-validator';
import { IAppConfig } from './typings';


export class AppConfig implements IAppConfig
{
    @IsIP()
    @IsNotEmpty()
    public readonly APP_HOST!: string;

    @IsNumberString()
    @IsNumber()
    public readonly APP_PORT!: string;
}


export function validateConfig(config: Record<string, any>): IAppConfig {
    const parsedConfig = plainToClass(AppConfig, config);
    const errors = validateSync(parsedConfig, { skipMissingProperties: true });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return parsedConfig;
}