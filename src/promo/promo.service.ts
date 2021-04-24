import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Promo, User } from './dal/models';


@Injectable()
export class PromoService
{
   constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      @InjectRepository(Promo)
      private readonly promoRepository: Repository<Promo>,
   ) {}

   public async test(): Promise<void> {
      const user = await this.userRepository.findOne({
         relations: ['promo'],
      });
      console.log('user:');
      console.log(user);
      const promo = await this.promoRepository.findOne({
         relations: ['holder'],
      });
      console.log('promo:');
      console.log(promo);
   }
}
