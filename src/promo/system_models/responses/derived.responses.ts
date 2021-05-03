import { BadRequestException } from '@nestjs/common';

import { ScenarioFailResponse, ScenarioSuccessResponse } from './core.responses';


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


export class NestValidationErrorResponse extends ScenarioFailResponse {    
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

export class ValidationErrorResponse extends ScenarioFailResponse {    
    constructor(messages: string | string[]) {
        const messagesArr = Array.isArray(messages) ? messages : [messages];
        const messageToShow = messagesArr.join('; ');
        super(messageToShow);
    }
}

//  *********************************
//  *                               *
//  *         System error          *
//  *                               *
//  *********************************