import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreatePromoTable1619165705822 implements MigrationInterface {

   public async up(qr: QueryRunner): Promise<void> {
      await qr.query(`CREATE TABLE \`promo\`
      (
         \`promocode\`     VARCHAR(8)  PRIMARY KEY,
         \`holder_id\`     BIGINT UNSIGNED  NOT NULL
                              REFERENCES \`users\` (ID) ON DELETE NO ACTION,
         \`activated_at\`  DATETIME  DEFAULT NULL,
         \`created_at\`    DATETIME  NOT NULL  DEFAULT CURRENT_TIMESTAMP
      )
      CHARACTER SET 'utf8'
      COLLATE 'utf8_general_ci';`);
   }

   public async down(qr: QueryRunner): Promise<void> {
      await qr.query('DROP TABLE IF EXISTS `promo`;');
   }

}