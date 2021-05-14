import { EScenarioStatus, IApiResponse, IScenarioFail, IScenarioSuccess, ISystemErrorResponse, IUnauthorized } from './typings';

import { DEFAULT_ERROR_MESSAGE } from '../constants';
import { ScenarioError, SystemError, UnauthorizedError } from '../errors';

declare const SECRET_SYMBOL: unique symbol;

export abstract class ApiResponse<T = string> implements IApiResponse<T> {
    // @ts-ignore
    private readonly [SECRET_SYMBOL]: unknown;
    constructor(
        public readonly status: EScenarioStatus,
        public readonly result: string,
        public readonly payload: T | null = null,
    ) {}
}

export class ScenarioSuccessResponse<T = string> extends ApiResponse<T> implements IScenarioSuccess<T> {
    public readonly status!: EScenarioStatus.SCENARIO_SUCCESS;
    
    constructor(result: string, payload?: T | null) {
        super(EScenarioStatus.SCENARIO_SUCCESS, result, payload);
    }
}

export class UnauthorizedResponse<T = string> extends ApiResponse<T> implements IUnauthorized<T>
{
    public static fromError(err: UnauthorizedError): UnauthorizedResponse {
        return new UnauthorizedResponse(err.message, err.payload);
    }

    public readonly status!: EScenarioStatus.UNAUTHORIZED;
    
    constructor(result: string, payload?: T | null) {
        super(EScenarioStatus.UNAUTHORIZED, result, payload);
    }
}

export class ScenarioFailResponse<T = string> extends ApiResponse<T> implements IScenarioFail<T>
{
    public static fromError(err: ScenarioError): ScenarioFailResponse {
        return new ScenarioFailResponse(err.message, err.payload);
    }

    public readonly status!: EScenarioStatus.SCENARIO_FAIL;
    
    constructor(result: string, payload?: T | null) {
        super(EScenarioStatus.SCENARIO_FAIL, result, payload);
    }
}

export class SystemErrorResponse<T = string> extends ApiResponse<T> implements ISystemErrorResponse<T>
{
    public static fromError(err: SystemError): SystemErrorResponse {
        return new SystemErrorResponse(err.message, err.payload);
    }

    public readonly status!: EScenarioStatus.SYSTEM_ERROR;
    
    constructor(result: string = DEFAULT_ERROR_MESSAGE, payload?: T | null) {
        super(EScenarioStatus.SYSTEM_ERROR, result, payload);
    }
}