import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CookieSerializeOptions } from 'fastify-cookie';

import { test } from './wrapper';

import { AuthGuard } from '../promo/providers/auth.guard';
import { UnauthorizedError } from '../promo/system_models';

const ADMIN_PASS = '123';
const ADMIN_PASS_KEY = 'ADMIN_PASS';

const authKey = 'authorization';
const cookieKey = `__Secure-${authKey}`;

const dummyConfigService: ConfigService = {
   get(key: string): string | undefined {
      return key === ADMIN_PASS_KEY ? ADMIN_PASS : undefined;
   },
} as any;

class DummyCtx {
   private req: FastifyRequest;
   private res: FastifyReply;
   public addedCookie?: {name: string, value: string, options?: CookieSerializeOptions};

   constructor(options?: {authHeader?: string, authCookie?: string}) {
      this.req = {
         headers: {},
      } as any;
      if (options?.authCookie) {
         this.req.cookies = {
            [cookieKey]: options.authCookie,
         };
      }
      if (options?.authHeader) {
         // @ts-ignore
         this.req.headers = {
            [authKey]: options.authHeader,
         };
      }

      const that = this;
      this.res = {
         setCookie(name: string, value: string, options?: CookieSerializeOptions): void {
            that.addedCookie = {name, value, options};
         },
      } as any;
   }

   public switchToHttp(): this {
      return this;
   }

   public getRequest(): FastifyRequest {
      return this.req;
   }

   public getResponse(): FastifyReply {
      return this.res;
   }
}

const ctxFactory = (options?: {authHeader?: string, authCookie?: string}): ExecutionContext & DummyCtx => {
   return new DummyCtx(options) as any;
};

test('AuthGuard', (t) => {
   const authGuard = new AuthGuard(dummyConfigService);

   try {
      authGuard.canActivate(ctxFactory());
   } catch (e) {
      t.strictEqual(e instanceof UnauthorizedError, true, 'empty password');
   }
   try {
      authGuard.canActivate(ctxFactory({authCookie: 'incorrect password'}));
   } catch (e) {
      t.strictEqual(e instanceof UnauthorizedError, true, 'incorrect password at cookie');
   }
   try {
      authGuard.canActivate(ctxFactory({authHeader: 'incorrect password'}));
   } catch (e) {
      t.strictEqual(e instanceof UnauthorizedError, true, 'incorrect password at header');
   }
   try {
      authGuard.canActivate(ctxFactory({authCookie: 'incorrect password', authHeader: ADMIN_PASS}));
   } catch (e) {
      t.strictEqual(e instanceof UnauthorizedError, true, 'incorrect password at cookie with not empty header');
   }

   const ctx1 = ctxFactory({authCookie: ADMIN_PASS});
   const result1 = authGuard.canActivate(ctx1);
   t.strictSame(result1, true, 'correct password at cookie');
   t.strictSame(ctx1.addedCookie, undefined, 'correct password at cookie');

   const ctx2 = ctxFactory({authHeader: ADMIN_PASS});
   const result2 = authGuard.canActivate(ctx2);
   t.strictSame(result2, true, 'correct password at header');
   t.strictEqual(ctx2.addedCookie, {name: cookieKey, value: ADMIN_PASS, options: {sameSite: 'strict', secure: true, httpOnly: true}}, 'correct password at header');

   t.end();
});