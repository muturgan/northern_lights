import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { PhoneDto } from './phone.dto';

export class PromoDto extends PhoneDto {
    @Transform(({ value }) => value.toLocaleLowerCase())
    @IsString({message: 'Введён некорректный промокод'})
    @IsNotEmpty({message: 'Введён некорректный промокод'})
    public readonly promocode!: string;
}