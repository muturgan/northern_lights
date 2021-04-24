import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

const phoneRe = /^(\+7)\d{10}$/;
const cleanupRe = /\s+|-|\(|\)/g;

export class PhoneDto {
    @Matches(phoneRe, {message: 'Введён некорректный номер телефона'})
    @Transform(({ value }) => value.startsWith('8') ? '+7' + value.substr(1) : value)
    @Transform(({ value }) => value.replace(cleanupRe, ''))
    @IsString({message: 'Введён некорректный номер телефона'})
    @IsNotEmpty({message: 'Введён некорректный номер телефона'})
    public readonly phone!: string;
}