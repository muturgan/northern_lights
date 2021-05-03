import {MigrationInterface, QueryRunner} from 'typeorm';

export class SetBirthdateToDade1620072842511 implements MigrationInterface {

   public async up(qr: QueryRunner): Promise<void> {
      await qr.query('ALTER TABLE users CHANGE birthdate birthdate DATE DEFAULT NULL;');
   }

   public async down(qr: QueryRunner): Promise<void> {
      await qr.query('ALTER TABLE users CHANGE birthdate birthdate DATETIME DEFAULT NULL;');
   }

}
