import {MigrationInterface, QueryRunner} from 'typeorm';

export class SetBirthdateNotNull1620151850159 implements MigrationInterface {

   public async up(qr: QueryRunner): Promise<void> {
      await qr.query('ALTER TABLE users CHANGE birthdate birthdate DATE NOT NULL;');
   }

   public async down(qr: QueryRunner): Promise<void> {
      await qr.query('ALTER TABLE users CHANGE birthdate birthdate DATE DEFAULT NULL;');
   }

}
