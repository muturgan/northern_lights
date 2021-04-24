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

export class ScenarioSuccess extends ApiResponse implements IScenarioSuccess {
    public readonly scenarioSuccess!: true;
    public readonly systemSuccess!: true;
    
    constructor(result: string, payload?: string | null) {
        super(true, true, result, payload);
    }
}

export class ScenarioFail extends ApiResponse implements IScenarioFail {
    public readonly scenarioSuccess!: false;
    public readonly systemSuccess!: true;
    
    constructor(result: string, payload?: string | null) {
        super(false, true, result, payload);
    }
}

export class SystemErrorResponse extends ApiResponse implements ISystemErrorResponse {
    public readonly scenarioSuccess!: false;
    public readonly systemSuccess!: false;
    
    constructor(result: string, payload?: string | null) {
        super(false, false, result, payload);
    }
}