export class ScenarioError extends Error {
    constructor(message: string) {
        super(message);
    }
}

const DEFAULT_ERROR_MESSAGE = 'Извините, система дала сбой.';

export class SystemError extends Error {
    constructor(message?: string) {
        super(message || DEFAULT_ERROR_MESSAGE);
    }
}