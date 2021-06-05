import { ValidationPipe } from '@nestjs/common';

export class PromoValidationPipe extends ValidationPipe {
   constructor() {
      super({ transform: true });
   }
}