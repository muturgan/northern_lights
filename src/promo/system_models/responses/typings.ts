export const enum EScenarioStatus {
   SCENARIO_SUCCESS,
   UNAUTHORIZED,
   SCENARIO_FAIL,
   SYSTEM_ERROR,
}
export interface IApiResponse<T = string> {
   readonly status: EScenarioStatus;
   readonly result: string;
   readonly payload: T | null;
}

export interface IScenarioSuccess<T = string> extends IApiResponse<T> {
   readonly status: EScenarioStatus.SCENARIO_SUCCESS;
}

export interface IUnauthorized<T = string> extends IApiResponse<T> {
   readonly status: EScenarioStatus.UNAUTHORIZED;
}

export interface IScenarioFail<T = string> extends IApiResponse<T> {
   readonly status: EScenarioStatus.SCENARIO_FAIL;
}

export interface ISystemErrorResponse<T = string> extends IApiResponse<T> {
   readonly status: EScenarioStatus.SYSTEM_ERROR;
}