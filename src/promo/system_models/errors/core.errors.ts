import { DEFAULT_ERROR_MESSAGE, UNKNOWN_ERROR_MESSAGE } from '../constants';

export abstract class AppError extends Error {
    public readonly payload: string | null;

    constructor(message: string, payload: string | null = null) {
        super(message);
        this.payload = payload;
    }
}

export class ScenarioError extends AppError {
    constructor(message: string, payload: string | null = null) {
        super(message, payload);
    }
}

export class SystemError extends AppError {
    constructor(message: string = DEFAULT_ERROR_MESSAGE, payload: string | null = null) {
        super(message, payload);
    }
}

export class UnknownError extends AppError {
    public readonly rawError: unknown;

    constructor(message: string = UNKNOWN_ERROR_MESSAGE, rawError: unknown = null) {
        super(message);
        this.rawError = rawError;
    }
}