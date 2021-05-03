import { isDateString, IsNotEmpty, IsOptional, IsString, registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

import { PhoneDto } from './phone.dto';

const NAME_ERROR_MESSAGE = 'Введено некорректное имя';
const shortDateRe = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD


function IsValidDate(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void {
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
                    const trimed = value.trim();

                    const valid = isDateString(trimed, {strict: true}) && shortDateRe.test(trimed);
                    if (valid !== true) {
                        return false;
                    }

                    // @ts-ignore
                    args.object[args.property] = trimed;
        
                    return valid;
                },
            },
        });
    };
}

export class RegistrationDto extends PhoneDto {
    @IsString({message: NAME_ERROR_MESSAGE})
    @IsNotEmpty({message: NAME_ERROR_MESSAGE})
    public readonly firstName!: string;

    @IsValidDate({message: 'Введена некорректная дата рождения'})
    @IsOptional()
    public readonly birthDate: string | null = null;
}