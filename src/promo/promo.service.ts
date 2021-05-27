import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import fsp = require('fs/promises');
import path = require('path');
import { EntityManager, getManager, QueryFailedError, Repository } from 'typeorm';

import { Promo, User } from './dal/models';
import { ApiResponse, PromoActivatedResponse, PromoAlreadyActivatedResponse, PromoNotExistsResponse, PromoValidResponse, UnauthorizedError, UnknownError, UserAlreadyExistsError, UserListResponse, UserRegisteredResponse } from './system_models';
import { ALPHABET, ALPHABET_LENGTH } from './validation';

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

const MIN_POSTFIX_VALUE = 1;
const MAX_POSTFIX_VALUE = 999;
const MAX_POSTFIX_LENGTH = 3;


@Injectable()
export class PromoService
{
   private readonly _authHeader: string;
   private _bips: ReadonlyArray<string> = []; // words from 4 to 8 chars

   constructor(
      @InjectRepository(User)
      private readonly _userRepository: Repository<User>,
      @InjectRepository(Promo)
      private readonly _promoRepository: Repository<Promo>,
      private readonly _config: ConfigService,
   ) {
      const authHeader = this._config.get<string>('ADMIN_PASS');
      if (authHeader === undefined) {
         throw new Error('Admin password not passed');
      }
      this._authHeader = authHeader;

      this._loadBips();
   }

   //  *********************************
   //  *                               *
   //  *          Public API           *
   //  *                               *
   //  *********************************

   public registerNewUser(firstName: string, phone: string, birthDate: string): Promise<ApiResponse> {
      return getManager().transaction<ApiResponse>(async (trx) => {
         const userId = await this._insertNewUser(firstName, phone, birthDate, trx)
            .catch((err) => this._checkUserDuplicationError(err, phone));

         const promocode = await this._grantPromo(userId, trx);
         return new UserRegisteredResponse(promocode);
      });
   }

   public async checkPromo(userPhone: string, promocode: string): Promise<ApiResponse> {
      const promos: ICheckResult[] = await this._promoRepository.query(
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

   public async activatePromo(userPhone: string, promocode: string): Promise<ApiResponse> {
      const result = await this.checkPromo(userPhone, promocode);

      if ((result instanceof PromoValidResponse) === false) {
         return result;
      }

      const updateResult: IOkPacket = await this._promoRepository.query(
         `UPDATE promo SET activated_at = ? WHERE promocode = ?;`,
         [new Date(), promocode],
      );
      if (updateResult.changedRows !== 1) {
         throw new UnknownError('Не удалось выполнить UPDATE для активации промокода');
      }

      return new PromoActivatedResponse();
   }

   public async getUsersList(authHeader?: string): Promise<UserListResponse> {
      if (authHeader !== this._authHeader) {
         throw new UnauthorizedError();
      }
      return this._findUsers().then((users) => new UserListResponse(users));
   }


   //  *********************************
   //  *                               *
   //  *        Private Methods        *
   //  *                               *
   //  *********************************

   private async _insertNewUser(firstname: string, phone: string, birthdate: string, trx: EntityManager): Promise<string> {
      const entity = this._userRepository.create({
         firstname,
         phone,
         birthdate,
      });
      const newUser = await trx.save(entity);

      return newUser.ID;
   }

   private async _grantPromo(holder_id: string, trx: EntityManager): Promise<string> {
      const promocode = this._generatePromoFromBips();
      const entity = this._promoRepository.create({
         promocode,
         holder_id,
      });
      const newPromo = await trx.save(entity);
      return newPromo.promocode;
   }

   protected _generateRandomPromo(promocodeLength: number = 8): string {
      const chars = [];
      for ( let i = 0; i < promocodeLength; i++ ) {
         chars.push(ALPHABET.charAt(Math.floor(Math.random() * ALPHABET_LENGTH)));
      }
      const promocode = chars.join('');
      return promocode;
   }

   private _generatePromoFromBips(): string {
      const randomIndex = this._generateRandomInt(0, this._bips.length - 1);
      const bip = this._bips[randomIndex];
      const postfix = this._generatePostfix();
      const promocode = `${bip}-${postfix}`;
      return promocode;
   }

   private _checkUserDuplicationError(err: unknown, phone: string): never {
      if (
         err instanceof QueryFailedError
         && (err as any).errno === 1062 // ER_DUP_ENTRY
         && (
            (err as any).sqlMessage.includes(`for key 'phone'`)
            || (err as any).sqlMessage.includes(`for key '${User.TABLE_NAME}.phone'`)
         )
      ) {
         throw new UserAlreadyExistsError(phone);
      }
      throw err;
   }

   private _findUsers(): Promise<User[]> {
      return this._userRepository.find({relations: ['promo'], order: {ID: 'ASC'}});
   }

   private _generateRandomInt(min: number, max: number): number {
      return Math.floor(Math.random() * max - min + 1) + min;
   }

   private _generatePostfix(): string {
      const randomInt = this._generateRandomInt(MIN_POSTFIX_VALUE, MAX_POSTFIX_VALUE);
      return randomInt.toString().padStart(MAX_POSTFIX_LENGTH, '0');
   }

   private async _loadBips(): Promise<void> {
      const fileBuf = await fsp.readFile(path.join(process.cwd(), 'bip39_russian.txt'));
      const content = fileBuf.toString('utf8');
      const words = content.split('\n');
      this._bips = words;
   }
}
