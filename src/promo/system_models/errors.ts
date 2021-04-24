import { DEFAULT_ERROR_MESSAGE, UNKNOWN_ERROR_MESSAGE } from './constants';

export class ScenarioError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class SystemError extends Error {
    constructor(message: string = DEFAULT_ERROR_MESSAGE) {
        super(message);
    }
}

export class UnknownError extends SystemError {
    public readonly payload: unknown;

    constructor(message: string = UNKNOWN_ERROR_MESSAGE, payload: unknown = null) {
        super(message);
        this.payload = payload;
    }
}