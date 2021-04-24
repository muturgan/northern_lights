import { IsNotEmpty, IsString } from 'class-validator';

export class PromoDto {
    @IsString()
    @IsNotEmpty()
    public readonly promocode!: string;

    @IsString()
    @IsNotEmpty()
    public readonly phone!: string;
}