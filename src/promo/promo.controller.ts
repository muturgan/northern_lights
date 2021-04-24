import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { PromoDto, RegistrationDto } from './dto';
import { PromoService } from './promo.service';
import { IApiResponse } from './system_models';


@UsePipes(new ValidationPipe({ transform: true }))


@Controller('api')
export class PromoController
{
   constructor(
      private readonly promoService: PromoService,
   ) {}


   @Post('registration')
   @HttpCode(HttpStatus.OK)
   public async register(@Body() body: RegistrationDto): Promise<IApiResponse>
   {
      return this.promoService.registerNewUser(body.firstName, body.phone, body.birthDate);
   }


   @Post('check')
   @HttpCode(HttpStatus.OK)
   public check(@Body() body: PromoDto): Promise<IApiResponse>
   {
      return this.promoService.checkPromo(body.phone, body.promocode);
   }


   @Post('activate')
   @HttpCode(HttpStatus.OK)
   public activate(@Body() body: PromoDto): Promise<IApiResponse>
   {
      return this.promoService.activatePromo(body.phone, body.promocode);
   }

}
