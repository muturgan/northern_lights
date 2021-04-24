import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { IApiResponse, ScenarioError, ScenarioFailResponse, SystemError, SystemErrorResponse, UnknownError } from '../system_models';



@Catch()
export class PromoExceptionFilter implements ExceptionFilter
{

   public catch(exception: unknown, host: ArgumentsHost): void
   {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<FastifyReply>();

      let response: IApiResponse | null = null;
      let unknownError: UnknownError | null = null;

      if (exception instanceof ScenarioError) {
         response = new ScenarioFailResponse(exception.message);
      }

      else if (exception instanceof SystemError) {
         response = new SystemErrorResponse(exception.message);
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
         console.log(unknownError);
         console.log('---------------');
         console.log(exception);
         console.log('-===========-\n');
      }

      res.send(response);
   }
}
