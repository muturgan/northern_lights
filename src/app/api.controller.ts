import { Controller, /*UseFilters, UsePipes, UseInterceptors,*/ HttpCode, HttpStatus, Post } from '@nestjs/common';


// @UsePipes()
// @UseFilters()
// @UseInterceptors()


@Controller('api')
export class ApiController
{
   @Post('registration')
   @HttpCode(HttpStatus.OK)
   public async register(): Promise<void>
   {
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
