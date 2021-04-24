import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configOptions } from './config';
import { Promo, User } from './promo/dal';
import { PromoModule } from './promo/promo.module';

const dbModels = [
   Promo,
   User,
];

@Module({
   imports: [
      PromoModule,
      ConfigModule.forRoot(configOptions),
      TypeOrmModule.forRootAsync({
         imports: [ConfigModule],
         useFactory: (config: ConfigService) => {
            const dbConfig = config.get('DB_CONFIG');
            dbConfig.entities = dbModels;
            return dbConfig;
         },
         inject: [ConfigService],
     }),
   ],
})
export class AppModule {}
