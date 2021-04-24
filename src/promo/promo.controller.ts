import { Controller, /*UseFilters, UsePipes, UseInterceptors,*/ HttpCode, HttpStatus, Post } from '@nestjs/common';

import { PromoService } from './promo.service';


// @UsePipes()
// @UseFilters()
// @UseInterceptors()


@Controller('api')
export class PromoController
{
   constructor(
      private readonly promoService: PromoService,
   ) {}


   @Post('registration')
   @HttpCode(HttpStatus.OK)
   public async register(): Promise<void>
   {
      return this.promoService.test();
   }


   @Post('check')
   @HttpCode(HttpStatus.OK)
   public async check(): Promise<void>
   {
   }


   @Post('activate')
   @HttpCode(HttpStatus.OK)
   public async activate(): Promise<void>
   {
   }

}
