import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateUserTable1619165702689 implements MigrationInterface {

    public async up(qr: QueryRunner): Promise<void> {
        await qr.query(`CREATE TABLE \`users\`
        (
            \`ID\`         BIGINT UNSIGNED  PRIMARY KEY  AUTO_INCREMENT,
            \`firstname\`  VARCHAR(32)  NOT NULL,
            \`birthdate\`  DATETIME  DEFAULT NULL,
            \`phone\`      CHAR(12)  NOT NULL  UNIQUE,
            \`email\`      VARCHAR(32)  DEFAULT NULL  UNIQUE,
            \`created_at\` DATETIME  DEFAULT CURRENT_TIMESTAMP
        );`);
    }

    public async down(qr: QueryRunner): Promise<void> {
        await qr.query('DROP TABLE IF EXISTS `users`;');
    }

}
