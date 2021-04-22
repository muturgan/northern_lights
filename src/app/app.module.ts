import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiController } from './api.controller';

import { configOptions } from '../config';

const dbEntities: Function[] = [];

@Module({
   imports: [
      ConfigModule.forRoot(configOptions),
      TypeOrmModule.forRootAsync({
         imports: [ConfigModule],
         useFactory: (config: ConfigService) => {
            const dbConfig = config.get('DB_CONFIG');
            dbConfig.entities = dbEntities;
            return dbConfig;
         },
         inject: [ConfigService],
     }),
   ],
   controllers: [ApiController],
   providers: [],
})
export class AppModule {}
