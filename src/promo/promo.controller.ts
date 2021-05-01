import { Body, Controller, HttpCode, HttpStatus, Post, UseFilters, UseInterceptors, UsePipes } from '@nestjs/common';

import { PromoService } from './promo.service';
import { PromoValidationPipe } from './providers';
import { JusticeInterceptor } from './providers/justice.interceptor';
import { PromoExceptionFilter } from './providers/promo.error.filter';
import { IApiResponse } from './system_models';
import { PromoDto, RegistrationDto } from './validation';


@UsePipes(new PromoValidationPipe())
@UseFilters(new PromoExceptionFilter())


@Controller('api')
export class PromoController
{
   constructor(
      private readonly _promoService: PromoService,
   ) {}


   @UseInterceptors(new JusticeInterceptor())
   @Post('registration')
   @HttpCode(HttpStatus.OK)
   public async register(@Body() body: RegistrationDto): Promise<IApiResponse>
   {
      return this._promoService.registerNewUser(body.firstName, body.phone, body.birthDate);
   }


   @Post('check')
   @HttpCode(HttpStatus.OK)
   public check(@Body() body: PromoDto): Promise<IApiResponse>
   {
      return this._promoService.checkPromo(body.phone, body.promocode);
   }


   @Post('activate')
   @HttpCode(HttpStatus.OK)
   public activate(@Body() body: PromoDto): Promise<IApiResponse>
   {
      return this._promoService.activatePromo(body.phone, body.promocode);
   }

}
