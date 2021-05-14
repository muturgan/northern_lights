import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, UseFilters, UseGuards, UsePipes } from '@nestjs/common';

import { User } from './dal';
import { PromoService } from './promo.service';
import { AuthGuard, PromoValidationPipe } from './providers';
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


   @Post('registration')
   @HttpCode(HttpStatus.OK)
   public async register(@Body() body: RegistrationDto): Promise<IApiResponse>
   {
      return this._promoService.registerNewUser(body.firstName, body.phone, body.birthDate);
   }


   @Post('check')
   @UseGuards(AuthGuard)
   @HttpCode(HttpStatus.OK)
   public check(@Body() body: PromoDto): Promise<IApiResponse>
   {
      return this._promoService.checkPromo(body.phone, body.promocode);
   }


   @Post('activate')
   @UseGuards(AuthGuard)
   @HttpCode(HttpStatus.OK)
   public activate(@Body() body: PromoDto): Promise<IApiResponse>
   {
      return this._promoService.activatePromo(body.phone, body.promocode);
   }

   @Get('users')
   @HttpCode(HttpStatus.OK)
   public getUsersList(@Headers('Authorization') authHeader?: string): Promise<IApiResponse<User[]>>
   {
      return this._promoService.getUsersList(authHeader);
   }

}
