import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app/app.module';
import { APP_HOST, APP_PORT } from './config';

async function bootstrap(): Promise<NestFastifyApplication>
{
   const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
   );

   const configService = app.get(ConfigService);
   const appPort = configService.get(APP_PORT);
   const appHost = configService.get(APP_HOST);

   await app.listen(appPort, appHost)
      .then(() => console.info(`App running on ${ appPort }`));

   return app;
}
export default bootstrap();
