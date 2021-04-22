import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';

async function bootstrap(): Promise<NestFastifyApplication>
{
   const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
   );

   await app.listen('7777', '0.0.0.0')
      .then(() => console.info(`App running on ${'port'}`));

   return app;
}
export default bootstrap();
