import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Promo, User } from './dal/models';
import { IApiResponse, PromoActivatedResponse, PromoAlreadyActivatedResponse, PromoNotExistsResponse, PromoValidResponse, SystemError, UserRegisteredResponse } from './system_models';

const ALPHABET = 'абвгдежзиклмнопрстуфхцчшэюя';
const ALPHABET_LENGTH = ALPHABET.length;

interface ICheckResult {
   promocode: string;
   phone: string;
   activated_at: Date | null;
}

interface IOkPacket {
   fieldCount: number;
   affectedRows: number;
   insertId: number;
   serverStatus: number;
   warningCount: number;
   message: string;
   protocol41: boolean;
   changedRows: number;
}


@Injectable()
export class PromoService
{
   constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      @InjectRepository(Promo)
      private readonly promoRepository: Repository<Promo>,
   ) {}

   //  *********************************
   //  *                               *
   //  *          Public API           *
   //  *                               *
   //  *********************************

   public async registerNewUser(firstName: string, phone: string, birthDate: Date | null): Promise<IApiResponse> {
      const userId = await this.insertNewUser(firstName, phone, birthDate);
      const promocode = await this.grantPromo(userId);
      return new UserRegisteredResponse(promocode);
   }

   public async checkPromo(userPhone: string, promocode: string): Promise<IApiResponse> {
      const promos: ICheckResult[] = await this.promoRepository.query(
         `SELECT promocode, phone, activated_at FROM promo P
            INNER JOIN users U ON P.holder_id = U.ID
            WHERE promocode = ? and phone = ?;`,
         [promocode, userPhone],
      );

      if (promos.length === 0) {
         return new PromoNotExistsResponse();
      }
      const promo = promos[0];
      if (promo.activated_at !== null) {
         return new PromoAlreadyActivatedResponse();
      }

      return new PromoValidResponse();
   }

   public async activatePromo(userPhone: string, promocode: string): Promise<IApiResponse> {
      const result = await this.checkPromo(userPhone, promocode);

      if ((result instanceof PromoValidResponse) === false) {
         return result;
      }

      const updateResult: IOkPacket = await this.promoRepository.query(
         `UPDATE promo SET activated_at = ? WHERE promocode = ?;`,
         [new Date(), promocode],
      );
      if (updateResult.changedRows !== 1) {
         throw new SystemError();
      }

      return new PromoActivatedResponse();
   }


   //  *********************************
   //  *                               *
   //  *        Private Methods        *
   //  *                               *
   //  *********************************

   private async insertNewUser(firstname: string, phone: string, birthdate: Date | null): Promise<string> {
      const entity = this.userRepository.create({
         firstname,
         phone,
         birthdate,
      });
      const newUser = await this.userRepository.save(entity);

      return newUser.ID;
   }

   private async grantPromo(holder_id: string): Promise<string> {
      const promocode = this.generateRandomPromo();
      const entity = this.promoRepository.create({
         promocode,
         holder_id,
      });
      const newPromo = await this.promoRepository.save(entity);
      return newPromo.promocode;
   }

   private generateRandomPromo(promocodeLength: number = 8): string {
      const chars = [];
      for ( let i = 0; i < promocodeLength; i++ ) {
         chars.push(ALPHABET.charAt(Math.floor(Math.random() * ALPHABET_LENGTH)));
      }
      const promocode = chars.join('');
      return promocode;
   }
}
