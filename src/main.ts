import fastifyCookie from '@fastify/cookie';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap(): Promise<NestFastifyApplication>
{
   const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
   );

   app.register(fastifyCookie);

   const configService = app.get(ConfigService);
   const appPort = configService.get('APP_PORT');
   const appHost = configService.get('APP_HOST');

   await app.listen(appPort, appHost)
      .then(() => console.info(`App running on ${ appPort }`));

   return app;
}
export default bootstrap();
