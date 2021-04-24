import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

import { PhoneDto } from './phone.dto';

import { ALPHABET } from '../constants';

const promoRe = new RegExp(`^[${ ALPHABET }]+$`);

function IsValidPromo(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void {
    return function (object: Object, propertyName: string): void {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                validate(value: unknown, args: ValidationArguments): boolean {
                    if (typeof value !== 'string') {
                        return false;
                    }
                    const trimed = value.trim().toLowerCase();
                    if (trimed.length < 5 || trimed.length > 8) {
                        return false;
                    }
                    const result = promoRe.test(trimed);

                    if (result === true) {
                        // @ts-ignore
                        args.object[args.property] = trimed;
                    }
        
                    return result;
                },
            },
        });
    };
}

export class PromoDto extends PhoneDto {
    @IsValidPromo({message: 'Введён некорректный промокод'})
    public readonly promocode!: string;
}