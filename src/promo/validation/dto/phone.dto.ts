import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

const phoneRe = /^(\+7)\d{10}$/;
const cleanupRe = /\s+|-|\(|\)/g;

function IsValidPhoneNumber(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void {
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
                    const trimed = value.replace(cleanupRe, '');
                    const transformed = trimed.startsWith('8') ? '+7' + trimed.substr(1) : trimed;
                    const result = phoneRe.test(transformed);

                    if (result === true) {
                        // @ts-ignore
                        args.object[args.property] = transformed;
                    }
        
                    return result;
                },
            },
        });
    };
}

export class PhoneDto {
    @IsValidPhoneNumber({message: 'Введён некорректный номер телефона'})
    public readonly phone!: string;
}