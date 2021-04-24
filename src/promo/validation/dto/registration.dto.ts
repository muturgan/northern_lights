import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PhoneDto } from './phone.dto';

export class RegistrationDto extends PhoneDto {
    @IsString({message: 'Введено некорректное имя'})
    @IsNotEmpty({message: 'Введено некорректное имя'})
    public readonly firstName!: string;

    @Transform(({ value }) => value ? new Date(value) : value)
    @IsDateString(undefined, {message: 'Введена некорректная дата рождения'})
    @IsOptional()
    public readonly birthDate: Date | null = null;
}