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