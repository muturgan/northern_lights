import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PromoDto {
    @Transform(({ value }) => value.toLocaleLowerCase())
    @IsString()
    @IsNotEmpty()
    public readonly promocode!: string;

    @IsString()
    @IsNotEmpty()
    public readonly phone!: string;
}