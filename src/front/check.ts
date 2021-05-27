import { EScenarioStatus, IApiResponse } from '../promo/system_models/responses/typings';

(() => {

const promoInput = document.body.querySelector('#promo-input-promo') as HTMLInputElement | null;
const phoneInput = document.body.querySelector('#promo-input-phone') as HTMLInputElement | null;
const output = document.body.querySelector('#promo-output') as HTMLOutputElement | null;
const checkButton = document.body.querySelector('#check-button-check') as HTMLButtonElement | null;
const activateButton = document.body.querySelector('#check-button-activate') as HTMLButtonElement | null;

if (promoInput === null || phoneInput === null || output === null || checkButton === null || activateButton === null) {
    throw new Error('incomplete html');
}

promoInput.addEventListener('input', () => {
   promoInput.value = promoInput.value.toUpperCase();
});

const CHECK_URL = 'api/check';
const ACTIVATE_URL = 'api/activate';

let pass = '';

interface IPostData {
    promocode: string;
    phone: string;
}

const phoneRe = /^(\+7)\d{10}$/;
const cleanupRe = /\s+|-|\(|\)/g;
const promoRe = /^[а-я]{4,8}-\d{3}$/;

const postData: IPostData = {
    promocode: '',
    phone: '',
};

const enterPass = () => {
    pass = prompt('Введите пароль') || '';
};

const checkPromo = (promo: string): string | null => {
    const trimed = promo.trim().toLowerCase();
    if (trimed.length === 0) {
        postData.promocode = '';
        return 'Промокод обязателен для ввода';
    }
    if (trimed.length < 8 || trimed.length > 12) {
        postData.promocode = '';
        return 'Вы ввели некорректный промокод';
    }

    const valid = promoRe.test(trimed);

    postData.promocode = valid === true ? trimed : '';

    return valid === true ? null : 'Вы ввели некорректный промокод';
};

const checkPhone = (phone: string): string | null => {
    const isString = typeof phone === 'string' && phone.length > 0;
    if (isString !== true) {
        postData.phone = '';
        return 'Tелефон обязателен для ввода';
    }

    const trimed = phone.replace(cleanupRe, '');
    const transformed = trimed.startsWith('8') ? '+7' + trimed.substr(1) : trimed;
    const valid = phoneRe.test(transformed);

    postData.phone = valid === true ? transformed : '';

    return valid === true ? null : 'Вы указали некорректный номер телефона';
};

const blockWorkspace = () => {
    checkButton.disabled = true;
    activateButton.disabled = true;
    promoInput.disabled = true;
    phoneInput.disabled = true;
    checkButton.classList.add('disabled');
    activateButton.classList.add('disabled');
};

const unblockWorkspace = () => {
    promoInput.disabled = false;
    phoneInput.disabled = false;
    checkButton.disabled = false;
    activateButton.disabled = false;
    checkButton.classList.remove('disabled');
    activateButton.classList.remove('disabled');
};

const handleApiResponse = (res: IApiResponse, btnElem: HTMLButtonElement): void => {
    pass = '';
    setTimeout(() => {
        output.innerText = res.result;
        switch (res.status) {
            case EScenarioStatus.SCENARIO_SUCCESS:
                output.classList.add('info');
                output.classList.remove('warning');
                output.classList.remove('error');
                break;

            case EScenarioStatus.UNAUTHORIZED:
                output.classList.remove('info');
                output.classList.add('warning');
                output.classList.remove('error');
                enterPass();
                break;

            case EScenarioStatus.SCENARIO_FAIL:
                output.classList.remove('info');
                output.classList.add('warning');
                output.classList.remove('error');
                break;

            case EScenarioStatus.SYSTEM_ERROR:
                output.classList.remove('info');
                output.classList.remove('warning');
                output.classList.add('error');
                break;
    
            default:
                output.classList.remove('info');
                output.classList.remove('warning');
                output.classList.remove('error');
        }

        postData.promocode = '';
        postData.phone = '';

        unblockWorkspace();
        btnElem.classList.remove('fetching');
    }, 1000);
};

const handleApiError = (err: unknown, btnElem: HTMLButtonElement) => {
    console.info('api error:');
    console.info(err);
    setTimeout(() => {
        output.innerText = 'Извините, произошла ошибка при обращиении к серверу';
        output.classList.remove('info');
        output.classList.remove('warning');
        output.classList.add('error');

        postData.promocode = '';
        postData.phone = '';

        unblockWorkspace();
        btnElem.classList.remove('fetching');
    }, 1000);
};

const handleNot200 = async (status: number, statusText: string, res: Promise<string>): Promise<never> => {
    console.info('Api call fail...');
    console.info('status:', status);
    console.info('statusText:', statusText);
    const body = await res;
    throw body;
};

const fetchData = (url: string, btnElem: HTMLButtonElement) => {
    blockWorkspace();
    btnElem.classList.add('fetching');

    const reqOptions = {
        method: 'post',
        body: JSON.stringify(postData),
        headers: {
            'Content-Type': 'application/json',
        } as Record<string, string>,
    };
    if (pass) {
        reqOptions.headers.authorization = pass;
    }
    fetch(url, reqOptions)
        .then((raw) => {
            return raw.ok === true
                ? raw.json()
                : handleNot200(raw.status, raw.statusText, raw.text());
        })
        .then((res) => handleApiResponse(res, btnElem))
        .catch((err) => handleApiError(err, btnElem));
};

checkButton.addEventListener('click', () => {
    const validationResults = [
        checkPromo(promoInput.value),
        checkPhone(phoneInput.value),
    ];

    const errors = validationResults.filter((r) => r !== null) as string[];

    if (errors.length > 0) {
        const errorMessage = errors.join('; ');
        output.innerText = errorMessage;
        output.classList.remove('info');
        output.classList.add('warning');
        output.classList.remove('error');
    }
    else {
        fetchData(CHECK_URL, checkButton);
    }
});

activateButton.addEventListener('click', () => {
    const validationResults = [
        checkPromo(promoInput.value),
        checkPhone(phoneInput.value),
    ];

    const errors = validationResults.filter((r) => r !== null) as string[];

    if (errors.length > 0) {
        const errorMessage = errors.join('; ');
        output.innerText = errorMessage;
        output.classList.remove('info');
        output.classList.add('warning');
        output.classList.remove('error');
    }
    else {
        fetchData(ACTIVATE_URL, activateButton);
    }
});

window.addEventListener('load', enterPass);

})();