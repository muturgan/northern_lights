import { EScenarioStatus, IApiResponse } from '../promo/system_models/responses/typings';

(() => {

const firstNameInput = document.body.querySelector('#promo-input-firstname') as HTMLInputElement | null;
const phoneInput = document.body.querySelector('#promo-input-phone') as HTMLInputElement | null;
const birthDateInput = document.body.querySelector('#promo-input-birthdate') as HTMLInputElement | null;
const output = document.body.querySelector('#promo-output') as HTMLOutputElement | null;
const button = document.body.querySelector('.promo-button') as HTMLButtonElement | null;

if (firstNameInput === null || phoneInput === null || birthDateInput === null || output === null || button === null) {
    throw new Error('incomplete html');
}

const URL = 'api/registration';

interface IPostData {
    firstName: string;
    phone: string;
    birthDate: string;
}

const phoneRe = /^(\+7)\d{10}$/;
const cleanupRe = /\s+|-|\(|\)/g;
const dateStrRe = /^\d{4}-\d{2}-\d{2}$/;

const postData: IPostData = {
    firstName: '',
    phone: '',
    birthDate: '',
};

const checkFirstName = (firstName: string): string | null => {
    const valid = typeof firstName === 'string' && firstName.length > 0;
    postData.firstName = valid === true ? firstName : '';
    return valid === true ? null : 'Имя обязательно для ввода';
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

const checkBirthDate = (birthDate: string): string | null => {
    const isString = typeof birthDate === 'string';
    if (isString !== true) {
        postData.birthDate = '';
        return 'Дата рождения обязательна для ввода';
    }

    const trimed = birthDate.trim();
    if (trimed === '') {
        postData.birthDate = '';
        return 'Дата рождения обязательна для ввода';
    }

    const valid = dateStrRe.test(trimed);

    postData.birthDate = valid === true ? trimed : '';

    return valid === true ? null : 'Вы ввели некорректную дату рождения';
};

const blockWorkspace = () => {
    button.disabled = true;
    firstNameInput.disabled = true;
    phoneInput.disabled = true;
    birthDateInput.disabled = true;
    button.classList.add('disabled');
    button.classList.add('fetching');
};

const unblockWorkspace = () => {
    firstNameInput.disabled = false;
    phoneInput.disabled = false;
    birthDateInput.disabled = false;
    button.disabled = false;
    button.classList.remove('disabled');
    button.classList.remove('fetching');
};

const handleApiResponse = (res: IApiResponse) => {
    setTimeout(() => {
        output.innerText = res.result;
        switch (res.status) {
            case EScenarioStatus.SCENARIO_SUCCESS:
                output.classList.add('info');
                output.classList.remove('warning');
                output.classList.remove('error');
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

        postData.firstName = '';
        postData.phone = '';
        postData.birthDate = '';

        unblockWorkspace();
    }, 1000);
};

const handleApiError = (err: unknown) => {
    console.log('api error:');
    console.log(err);
    setTimeout(() => {
        output.innerText = 'Извините, произошла ошибка при обращиении к серверу';
        output.classList.remove('info');
        output.classList.remove('warning');
        output.classList.add('error');

        postData.firstName = '';
        postData.phone = '';
        postData.birthDate = '';

        unblockWorkspace();
    }, 1000);
};

const handleNot200 = async (status: number, statusText: string, res: Promise<string>): Promise<never> => {
    console.log('Api call fail...');
    console.log('status:', status);
    console.log('statusText:', statusText);
    const body = await res;
    throw body;
};

const fetchData = () => {
    blockWorkspace();
    const reqOptions = {
        method: 'post',
        body: JSON.stringify(postData),
        headers: {'Content-Type': 'application/json'},
    };
    fetch(URL, reqOptions)
        .then((raw) => {
            return raw.ok === true
                ? raw.json()
                : handleNot200(raw.status, raw.statusText, raw.text());
        })
        .then(handleApiResponse)
        .catch(handleApiError);
};

button.addEventListener('click', () => {
    const validationResults = [
        checkFirstName(firstNameInput.value),
        checkPhone(phoneInput.value),
        checkBirthDate(birthDateInput.value),
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
        fetchData();
    }
});

})();