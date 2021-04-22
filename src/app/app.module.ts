import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configOptions } from '../config';
import { ApiController } from './api.controller';

@Module({
   imports: [ConfigModule.forRoot(configOptions)],
   controllers: [ApiController],
   providers: [],
})
export class AppModule {}
