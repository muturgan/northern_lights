import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyRequest } from 'fastify';

import { UnauthorizedError } from '../system_models';

@Injectable()
export class AuthGuard implements CanActivate
{
   private readonly _authHeader: string;

   constructor(private readonly _config: ConfigService) {
      const authHeader = this._config.get<string>('ADMIN_PASS');
      if (authHeader === undefined) {
         throw new Error('Admin password not passed');
      }
      this._authHeader = authHeader;
   }

   public canActivate(ctx: ExecutionContext): boolean {
      const req = ctx.switchToHttp().getRequest<FastifyRequest>();
      const authHeader = req.headers?.authorization;
      if (authHeader !== this._authHeader) {
         throw new UnauthorizedError();
      }
      return true;
   }
}