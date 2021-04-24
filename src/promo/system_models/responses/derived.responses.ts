import { ScenarioFail, ScenarioSuccess } from './core.responses';


//  *********************************
//  *                               *
//  *       Scenario Success        *
//  *                               *
//  *********************************

export class UserRegisteredResponse extends ScenarioSuccess {    
    constructor(promoCode: string) {
        const message = `Новый пользователь успешно зарегистрирован. Промокод: ${promoCode}`;
        super(message, promoCode);
    }
}

export class PromoValidResponse extends ScenarioSuccess {    
    constructor() {
        super('Промокод корректен');
    }
}

export class PromoActivatedResponse extends ScenarioSuccess {    
    constructor() {
        super('Промокод успешно активирован');
    }
}



//  *********************************
//  *                               *
//  *        Scenario Fail          *
//  *                               *
//  *********************************
export class PromoNotExistsResponse extends ScenarioFail {    
    constructor() {
        super('Данный промокод не существует');
    }
}

export class PromoAlreadyActivatedResponse extends ScenarioFail {    
    constructor() {
        super('Данный промокод уже был активирован');
    }
}


//  *********************************
//  *                               *
//  *         System error          *
//  *                               *
//  *********************************