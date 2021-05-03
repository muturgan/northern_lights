import { CheckerFunctionError, ValidationSchema } from 'fastest-validator';

import { IPhoneData, PhoneSchema } from './phone.schema';

import { ALPHABET } from '../constants';

const promoRe = new RegExp(`^[${ ALPHABET }]+$`);

export interface IPromoRequestData extends IPhoneData {
   readonly promocode: string;
}


export class PromoRequestSchema extends PhoneSchema implements ValidationSchema<IPromoRequestData> {
   public readonly promocode = {
      type: 'custom',
      messages: {
         promocode: 'Введён некорректный промокод',
      },
      check(value: string, errors: CheckerFunctionError[]): string {
         if (typeof value !== 'string') {
            errors.push({ type: 'promocode', actual: value });
            return value;
         }

         const trimed = value.trim().toLowerCase();
         if (trimed.length < 5 || trimed.length > 8) {
            errors.push({ type: 'promocode', actual: value });
            return value;
         }

         const result = promoRe.test(trimed);

         if (result !== true) {
            errors.push({ type: 'promocode', actual: value });
            return value;
         }

         return trimed;
      },
   };
}