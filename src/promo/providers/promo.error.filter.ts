import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { PromoValidationPipe } from './promo.validation.pipe';

import { IApiResponse, ScenarioError, ScenarioFailResponse, SystemError, SystemErrorResponse, UnauthorizedError, UnauthorizedResponse, UnknownError, ValidationErrorResponse } from '../system_models';



@Catch()
export class PromoExceptionFilter implements ExceptionFilter
{

   public catch(exception: unknown, host: ArgumentsHost): void
   {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<FastifyReply>();

      let response: IApiResponse | null = null;
      let unknownError: UnknownError | null = null;

      if (exception instanceof UnauthorizedError) {
         response = UnauthorizedResponse.fromError(exception);
      }

      else if (exception instanceof ScenarioError) {
         response = ScenarioFailResponse.fromError(exception);
      }

      else if (exception instanceof SystemError) {
         response = SystemErrorResponse.fromError(exception);
      }

      else if (exception instanceof BadRequestException && exception.stack?.includes(PromoValidationPipe.name)) {
         response = new ValidationErrorResponse(exception);
      }

      else if (exception instanceof HttpException) {
         res.code(exception.getStatus()).send(exception.getResponse());
         return;
      }

      else if (exception instanceof Error) {
         unknownError = new UnknownError(exception.message);
         unknownError.stack = exception.stack;
      }

      else if (typeof exception === 'string' || exception instanceof String) {
         unknownError = new UnknownError(exception.toString());
      }

      if (response === null) {
         response = new SystemErrorResponse();
      }

      if (unknownError !== null) {
         unknownError = new UnknownError(undefined, exception);
         console.log('\n-= OMFG... =-');
         console.log(unknownError.message);
         console.log('---------------');
         console.log(exception);
         console.log('-===========-\n');
      }

      res.send(response);
   }
}
