import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import { PhoneDto } from './phone.dto';

import { ALPHABET } from '../constants';

const promoRe = new RegExp(`^[${ ALPHABET }]+$`);

export class PromoDto extends PhoneDto {
    @Matches(promoRe, {message: 'Введён некорректный промокод'})
    @Length(5, 8, {message: 'Введён некорректный промокод'})
    @Transform(({ value }) => value.trim().toLocaleLowerCase())
    @IsString({message: 'Введён некорректный промокод'})
    @IsNotEmpty({message: 'Введён некорректный промокод'})
    public readonly promocode!: string;
}