import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE, UNKNOWN_ERROR_MESSAGE } from '../constants';

declare const SCENARIO_FAIL_SYMBOL: unique symbol;
declare const SYSTEM_ERROR_SYMBOL:  unique symbol;
declare const UNAUTHORIZED_SYMBOL:  unique symbol;

export abstract class AppError extends Error {
    public readonly payload: string | null;

    constructor(message: string, payload: string | null = null) {
        super(message);
        this.payload = payload;
    }
}

export class ScenarioError extends AppError {
    // @ts-ignore
    private readonly [SYSTEM_ERROR_SYMBOL]: unknown;
    constructor(message: string, payload: string | null = null) {
        super(message, payload);
    }
}

export class UnauthorizedError extends AppError {
    // @ts-ignore
    private readonly [UNAUTHORIZED_SYMBOL]: unknown;
    constructor(message: string = UNAUTHORIZED_ERROR_MESSAGE, payload: string | null = null) {
        super(message, payload);
    }
}

export class SystemError extends AppError {
    // @ts-ignore
    private readonly [SCENARIO_FAIL_SYMBOL]: unknown;
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