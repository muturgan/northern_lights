import { ScenarioError } from './core.errors';

export class UserAlreadyExistsError extends ScenarioError {
   constructor(phone: string) {
      const message = `Пользователь с номером телефона ${phone} уже существует`;
      super(message, phone);
   }
}

export class JusticeError extends ScenarioError {
   constructor() {
      super('Илья, переведи гонорар...');
   }
}