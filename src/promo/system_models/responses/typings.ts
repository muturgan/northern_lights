   //  *********************************
   //  *                               *
   //  *            Common             *
   //  *                               *
   //  *********************************
   
export const enum EScenarioStatus {
    SCENARIO_SUCCESS,
    SCENARIO_FAIL,
    SYSTEM_ERROR,
}
export interface IApiResponse {
    readonly status: EScenarioStatus;
    readonly result: string;
    readonly payload: string | null;
}

export interface IScenarioSuccess extends IApiResponse {
    readonly status: EScenarioStatus.SCENARIO_SUCCESS;
}

export interface IScenarioFail extends IApiResponse {
    readonly status: EScenarioStatus.SCENARIO_FAIL;
}

export interface ISystemErrorResponse extends IApiResponse {
    readonly status: EScenarioStatus.SYSTEM_ERROR;
}


   //  *********************************
   //  *                               *
   //  *            Admin              *
   //  *                               *
   //  *********************************

export const enum EAdminScenarioStatus {
    SCENARIO_SUCCESS,
    UNAUTHORIZED,
    SYSTEM_ERROR,
}

export interface IAdminApiResponse<T> {
    readonly status: EAdminScenarioStatus;
    readonly payload: T;
}