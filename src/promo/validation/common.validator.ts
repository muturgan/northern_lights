import Validator from 'fastest-validator';

export const commonValidator = new Validator({
    useNewCustomCheckerFunction: true,
});