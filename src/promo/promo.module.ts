import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Promo, User } from './dal';
import { PromoController } from './promo.controller';
import { PromoService } from './promo.service';

@Module({
   imports: [TypeOrmModule.forFeature([Promo, User])],
   controllers: [PromoController],
   providers: [PromoService],
})
export class PromoModule {}
