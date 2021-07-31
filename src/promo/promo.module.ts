import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Promo, User } from './dal/index';
import { PromoController } from './promo.controller';
import { PromoService } from './promo.service';

@Module({
   imports: [
      TypeOrmModule.forFeature([Promo, User]),
      ConfigModule,
   ],
   controllers: [PromoController],
   providers: [PromoService],
})
export class PromoModule {}
