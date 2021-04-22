import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app/app.module';

async function bootstrap(): Promise<NestFastifyApplication>
{
   const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
   );

   const configService = app.get(ConfigService);
   const APP_PORT = configService.get('APP_PORT');
   const APP_HOST = configService.get('APP_HOST');

   await app.listen(APP_PORT, APP_HOST)
      .then(() => console.info(`App running on ${ APP_PORT }`));

   return app;
}
export default bootstrap();
