import { CheckerFunctionError, ValidationSchema } from 'fastest-validator';

const phoneRe = /^(\+7)\d{10}$/;
const cleanupRe = /\s+|-|\(|\)/g;

export interface IPhoneData {
   readonly phone: string;
}

export class PhoneSchema implements ValidationSchema<IPhoneData> {
   public readonly phone = {
      type: 'custom',
      messages: {
         phone: 'Введён некорректный номер телефона',
      },
      check(value: string, errors: CheckerFunctionError[]): string {
         if (typeof value !== 'string') {
            errors.push({ type: 'phone', actual: value });
            return value;
         }

         const trimed = value.replace(cleanupRe, '');
         const transformed = trimed.startsWith('8') ? '+7' + trimed.substr(1) : trimed;
         const result = phoneRe.test(transformed);

         if (result !== true) {
            errors.push({ type: 'phone', actual: value });
            return value;
         }

         return transformed;
      },
   };
}