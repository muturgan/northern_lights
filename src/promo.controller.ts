import Validator, { ValidationError, ValidationSchema } from 'fastest-validator';

import { ApiResponse, PromoValidResponse, ValidationErrorResponse } from './promo/system_models';
import { commonValidator } from './promo/validation/common.validator';
import { IRegistrationRequestData, RegistrationSchema } from './promo/validation/schemas/registration.schema';

type TValidationResult = true | ValidationError[];
type TCheckFunc = (value: unknown) => TValidationResult;


export class RouteHandler<T> {

   private readonly _process: (arg: T) => Promise<ApiResponse>;
   private readonly _validate: TCheckFunc;

   constructor(
      validatorCompiler: Validator,
      SchemaClass: new () => ValidationSchema<T>,
      handler: (arg: T) => Promise<ApiResponse>,
   ) {
      this._validate = validatorCompiler.compile(new SchemaClass);
      this._process = handler;
   }

   public async run(arg: T): Promise<ApiResponse> {
      const validationResult = this._validate(arg);
      if (validationResult !== true) {
         const errorMessages = validationResult.map((err) => err.message || '');
         return new ValidationErrorResponse(errorMessages);
      }

      return this._process(arg);
   }
}

export const registrationRouteHandler = new RouteHandler(
   commonValidator,
   RegistrationSchema,
   async (arg: IRegistrationRequestData): Promise<ApiResponse> => {
      console.log('run!');
      console.log(arg);
      return new PromoValidResponse();
   },
);