import dotenv = require('dotenv');
const {error, parsed} = dotenv.config();
if (error !== undefined || parsed === undefined) {
   throw error;
}

export const config = {
   APP_HOST: parsed.APP_HOST,
   APP_PORT: parseInt(parsed.APP_PORT, 10),
   ADMIN_PASS: parsed.ADMIN_PASS,
   DB_CONFIG: {
      host: parsed.DB_HOST,
      port: parseInt(parsed.DB_PORT, 10),
      user: parsed.DB_USER,
      password: parsed.DB_PASS,
      database: parsed.DB_NAME,
      timezone: parsed.DB_TIME,
   },
};