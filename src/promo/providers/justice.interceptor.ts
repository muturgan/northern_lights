import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
// import type { FastifyReply } from 'fastify';
// import type { Server } from 'http';
import type { Observable } from 'rxjs';

import { JusticeError } from '../system_models';


export class JusticeInterceptor implements NestInterceptor
{
   public intercept(_context: ExecutionContext, _next: CallHandler): Observable<any /* body */>
   {
      throw new JusticeError();
      // const res = context.switchToHttp().getResponse<FastifyReply<Server>>();

      // const contentType = res.getHeader('content-type');

      // if (contentType === undefined) {
      //    res.header('Content-Type', 'application/xml');
      // }

      // return next.handle();
   }

}
