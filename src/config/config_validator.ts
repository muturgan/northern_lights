import { plainToClass, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsIP, IsNotEmpty, IsString, ValidateNested, validateSync } from 'class-validator';

import { IAppConfig } from './typings';

export class DbConfig
{
    @IsString()
    @IsNotEmpty()
    public readonly type!: string;

    @IsString()
    @IsNotEmpty()
    public readonly host!: string;

    @IsInt()
    @IsNotEmpty()
    public readonly port!: number;

    @IsString()
    @IsNotEmpty()
    public readonly username!: string;

    @IsString()
    @IsNotEmpty()
    public readonly password!: string;

    @IsString()
    @IsNotEmpty()
    public readonly database!: string;

    @IsBoolean()
    @IsNotEmpty()
    public readonly synchronize!: boolean;

    @IsBoolean()
    @IsNotEmpty()
    public readonly logging!: boolean;

    @IsString()
    @IsNotEmpty()
    public readonly timezone!: string;
}


export class AppConfig implements IAppConfig
{
    @IsIP()
    @IsNotEmpty()
    public readonly APP_HOST!: string;

    @IsInt()
    @IsNotEmpty()
    public readonly APP_PORT!: number;

    @ValidateNested()
    @Type(() => DbConfig)
    @IsNotEmpty()
    public readonly DB_CONFIG!: DbConfig;
}


export function validateConfig(config: Record<string, any>): IAppConfig {
    const parsedConfig = plainToClass(AppConfig, config);
    const errors = validateSync(parsedConfig);

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return parsedConfig;
}