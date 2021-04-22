import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiController } from './api.controller';

import { configOptions } from '../config';

@Module({
   imports: [ConfigModule.forRoot(configOptions)],
   controllers: [ApiController],
   providers: [],
})
export class AppModule {}
