import { ValidationSchema } from 'fastest-validator';

import { IPhoneData, PhoneSchema } from './phone.schema';

export interface IRegistrationRequestData extends IPhoneData {
    readonly firstName: string;
    readonly birthDate: Date | null;
}


export class RegistrationSchema extends PhoneSchema implements ValidationSchema<IRegistrationRequestData>
{
    public readonly firstName = {
        type: 'string',
        messages: {
            firstName: 'Введено некорректное имя',
        },
    };

    public readonly birthDate = {
        type: 'date',
        convert: true,
        nullable: true,
        optional: true,
        default: null,
        messages: {
            birthDate: 'Введена некорректная дата рождения',
        },
    };
}