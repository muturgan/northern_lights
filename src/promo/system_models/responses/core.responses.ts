import { DEFAULT_ERROR_MESSAGE } from '../constants';
import { ScenarioError, SystemError } from '../errors';

//  *********************************
//  *                               *
//  *          Inderfaces           *
//  *                               *
//  *********************************

export interface IApiResponse {
    readonly scenarioSuccess: boolean;
    readonly systemSuccess: boolean;
    readonly result: string;
    readonly payload: string | null;
}

export interface IScenarioSuccess extends IApiResponse {
    readonly scenarioSuccess: true;
    readonly systemSuccess: true;
}

export interface IScenarioFail extends IApiResponse {
    readonly scenarioSuccess: false;
    readonly systemSuccess: true;
}

export interface ISystemErrorResponse extends IApiResponse {
    readonly scenarioSuccess: false;
    readonly systemSuccess: false;
}


//  *********************************
//  *                               *
//  *            Models             *
//  *                               *
//  *********************************

export class ApiResponse implements IApiResponse {
    constructor(
        public readonly scenarioSuccess: boolean,
        public readonly systemSuccess: boolean,
        public readonly result: string,
        public readonly payload: string | null = null,
    ) {}
}

export class ScenarioSuccessResponse extends ApiResponse implements IScenarioSuccess {
    public readonly scenarioSuccess!: true;
    public readonly systemSuccess!: true;
    
    constructor(result: string, payload?: string | null) {
        super(true, true, result, payload);
    }
}

export class ScenarioFailResponse extends ApiResponse implements IScenarioFail
{
    public static fromError(err: ScenarioError): ScenarioFailResponse {
        return new ScenarioFailResponse(err.message, err.payload);
    }

    public readonly scenarioSuccess!: false;
    public readonly systemSuccess!: true;
    
    constructor(result: string, payload?: string | null) {
        super(false, true, result, payload);
    }
}

export class SystemErrorResponse extends ApiResponse implements ISystemErrorResponse
{
    public static fromError(err: SystemError): SystemErrorResponse {
        return new SystemErrorResponse(err.message, err.payload);
    }

    public readonly scenarioSuccess!: false;
    public readonly systemSuccess!: false;
    
    constructor(result: string = DEFAULT_ERROR_MESSAGE, payload?: string | null) {
        super(false, false, result, payload);
    }
}