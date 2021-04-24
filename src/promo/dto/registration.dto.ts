import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegistrationDto {
    @IsString()
    @IsNotEmpty()
    public readonly firstName!: string;

    @IsString()
    @IsNotEmpty()
    public readonly phone!: string;

    @Transform(({ value }) => value ? new Date(value) : value)
    @IsDateString()
    @IsOptional()
    public readonly birthDate: Date | null = null;
}