import { EScenarioStatus, IApiResponse, IScenarioFail, IScenarioSuccess, ISystemErrorResponse } from './typings';

import { DEFAULT_ERROR_MESSAGE } from '../constants';
import { ScenarioError, SystemError } from '../errors';

const SECRET_SYMBOL = Symbol('SECRET_SYMBOL');

export class ApiResponse implements IApiResponse {
    // @ts-ignore
    private readonly [SECRET_SYMBOL]: unknown;
    constructor(
        public readonly status: EScenarioStatus,
        public readonly result: string,
        public readonly payload: string | null = null,
    ) {}
}

export class ScenarioSuccessResponse extends ApiResponse implements IScenarioSuccess {
    public readonly status!: EScenarioStatus.SCENARIO_SUCCESS;
    
    constructor(result: string, payload?: string | null) {
        super(EScenarioStatus.SCENARIO_SUCCESS, result, payload);
    }
}

export class ScenarioFailResponse extends ApiResponse implements IScenarioFail
{
    public static fromError(err: ScenarioError): ScenarioFailResponse {
        return new ScenarioFailResponse(err.message, err.payload);
    }

    public readonly status!: EScenarioStatus.SCENARIO_FAIL;
    
    constructor(result: string, payload?: string | null) {
        super(EScenarioStatus.SCENARIO_FAIL, result, payload);
    }
}

export class SystemErrorResponse extends ApiResponse implements ISystemErrorResponse
{
    public static fromError(err: SystemError): SystemErrorResponse {
        return new SystemErrorResponse(err.message, err.payload);
    }

    public readonly status!: EScenarioStatus.SYSTEM_ERROR;
    
    constructor(result: string = DEFAULT_ERROR_MESSAGE, payload?: string | null) {
        super(EScenarioStatus.SYSTEM_ERROR, result, payload);
    }
}