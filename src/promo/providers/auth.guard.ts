import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { UnauthorizedError } from '../system_models/index';

const authKey = 'authorization';
const cookieKey = `__Secure-${authKey}`;

@Injectable()
export class AuthGuard implements CanActivate
{
   private readonly _pass: string;

   constructor(private readonly _config: ConfigService) {
      const pass = this._config.get<string>('ADMIN_PASS');
      if (pass === undefined) {
         throw new Error('Admin password not passed');
      }
      this._pass = pass;
   }

   public canActivate(ctx: ExecutionContext): boolean {
      const req = ctx.switchToHttp().getRequest<FastifyRequest>();
      const res = ctx.switchToHttp().getResponse<FastifyReply>();

      const authCookie = req.cookies?.[cookieKey];
      const authHeader = req.headers?.[authKey];
      const pass = authCookie || authHeader;

      if (pass !== this._pass) {
         throw new UnauthorizedError();
      }

      if (authCookie === undefined) {
         res.setCookie(cookieKey, pass, {sameSite: 'strict', secure: true, httpOnly: true});
         // res.header('Set-Cookie', `${cookieKey}=${pass}; SameSite; Secure; HttpOnly`);
      }

      return true;
   }
}