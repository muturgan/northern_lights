import {MigrationInterface, QueryRunner} from 'typeorm';

export class IncreasePromocodeLength1622152100121 implements MigrationInterface {

   public async up(qr: QueryRunner): Promise<void> {
      // primary key is saved
      await qr.query('ALTER TABLE promo CHANGE promocode promocode VARCHAR(12);');
   }

   public async down(qr: QueryRunner): Promise<void> {
      await qr.query('ALTER TABLE promo CHANGE promocode promocode VARCHAR(8);');
   }

}
