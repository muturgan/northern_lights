import dotenv from 'dotenv';

const {error, parsed} = dotenv.config();
if (error !== undefined || parsed === undefined) {
   throw error;
}

export const options = {
   APP_HOST: parsed.APP_HOST,
   APP_PORT: parsed.APP_PORT,

   ADMIN_PASS: parsed.ADMIN_PASS,

   type: parsed.DB_TYPE as 'mysql',
   host: parsed.DB_HOST,
   port: parseInt(parsed.DB_PORT, 10),
   username: parsed.DB_USER,
   password: parsed.DB_PASS,
   database: parsed.DB_NAME,
   autoLoadEntities: false,
   synchronize: parsed.DB_SYNC === 'true',
   logging: parsed.DB_LOG === 'true',
   timezone: parsed.DB_TIME,
   migrations: [
      `./dist/promo/dal/migrations/*`,
   ],
   cli: {
      'migrationsDir': `src/promo/dal/migrations`,
   },
};
