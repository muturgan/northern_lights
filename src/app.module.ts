import { DynamicModule, Module, Type } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import path from 'path';

import { configOptions } from './config';
import { Promo, User } from './promo/dal';
import { PromoModule } from './promo/promo.module';

const dbModels = [
   Promo,
   User,
];

const imports: Array<DynamicModule | Type<any>> = [
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
];

// if (process.env.NODE_ENV === 'dev') {
//    imports.push(
//       ServeStaticModule.forRoot({
//          rootPath: path.join(process.cwd(), 'static'),
//       }),
//    );
// }

@Module({imports})
export class AppModule {}
