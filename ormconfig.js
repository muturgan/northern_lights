const dotenv = require('dotenv');
const {error, parsed} = dotenv.config();
if (error !== undefined || parsed === undefined) {
    throw error;
}

const options = {
    APP_HOST: parsed.APP_HOST,
    APP_PORT: parsed.APP_PORT,

    type: parsed.DB_TYPE,
    host: parsed.DB_HOST,
    port: parseInt(parsed.DB_PORT, 10),
    username: parsed.DB_USER,
    password: parsed.DB_PASS,
    database: parsed.DB_NAME,
    autoLoadEntities: false,
    synchronize: false,
    logging: parsed.DB_LOG === 'true',
    migrations: [
        `./dist/promo/dal/migrations/*`
    ],
    cli: {
        "migrationsDir": `src/promo/dal/migrations`,
    },
    extra: {
        timezone: parsed.DB_TIME,
    },
};


module.exports = options;
