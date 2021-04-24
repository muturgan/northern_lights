import { ScenarioFailResponse, ScenarioSuccessResponse } from './core.responses';


//  *********************************
//  *                               *
//  *       Scenario Success        *
//  *                               *
//  *********************************

export class UserRegisteredResponse extends ScenarioSuccessResponse {    
    constructor(promoCode: string) {
        const message = `Новый пользователь успешно зарегистрирован. Промокод: ${promoCode}`;
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


//  *********************************
//  *                               *
//  *         System error          *
//  *                               *
//  *********************************