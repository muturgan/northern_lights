import { BadRequestException } from '@nestjs/common';

import { ScenarioFailResponse, ScenarioSuccessResponse } from './core.responses';

import type { User } from '../../dal';


//  *********************************
//  *                               *
//  *       Scenario Success        *
//  *                               *
//  *********************************

export class UserRegisteredResponse extends ScenarioSuccessResponse {
   constructor(promoCode: string) {
      const message = `Новый пользователь успешно зарегистрирован. Промокод: ${promoCode.toUpperCase()}`;
      super(message, promoCode);
   }
}

export class PromoValidResponse extends ScenarioSuccessResponse {
   constructor() {
      super('Промокод корректен');
   }
}

export class PromoActivatedResponse extends ScenarioSuccessResponse {
   constructor() {
      super('Промокод успешно активирован');
   }
}

export class UserListResponse extends ScenarioSuccessResponse<User[]> {
   constructor(users: User[]) {
      super('Список пользователей', users);
   }
}



//  *********************************
//  *                               *
//  *        Scenario Fail          *
//  *                               *
//  *********************************

export class UserAlreadyExistsResponse extends ScenarioFailResponse {
   constructor(phone: string) {
      const message = `Пользователь с номером телефона ${phone} уже существует`;
      super(message, phone);
   }
}
export class PromoNotExistsResponse extends ScenarioFailResponse {
   constructor() {
      super('Данный промокод не существует');
   }
}

export class PromoAlreadyActivatedResponse extends ScenarioFailResponse {
   constructor() {
      super('Данный промокод уже был активирован');
   }
}


export class ValidationErrorResponse extends ScenarioFailResponse {
   constructor(err: BadRequestException) {
      interface IValidationErrorBody {
         statusCode: number;
         message: string[];
         error: string;
      }

      const body = err.getResponse() as IValidationErrorBody;
      const messageObj: Record<string, null> = {};
      body.message.forEach((m) => messageObj[m] = null);
      const messageToShow = Object.keys(messageObj).join('; ');

      super(messageToShow);
   }
}

//  *********************************
//  *                               *
//  *         System error          *
//  *                               *
//  *********************************