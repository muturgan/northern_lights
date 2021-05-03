import mysql from 'mysql';

interface ICheckResult {
   promocode: string;
   phone: string;
   activated_at: Date | null;
}

export class Dal {

   private readonly _pool: mysql.Pool;

   constructor(config: mysql.PoolConfig) {
      this._pool = mysql.createPool({
         host    : config.host,
         port    : config.port,
         user    : config.user,
         password: config.password,
         database: config.database,
         timezone: config.timezone,
      });
   }

   public async checkPromo(userPhone: string, promocode: string): Promise<{activated_at: Date | null} | null> {
      const promos = await this._call<ICheckResult[]>(
         `SELECT promocode, phone, activated_at FROM promo P
            INNER JOIN users U ON P.holder_id = U.ID
            WHERE promocode = ? and phone = ?;`,
         [promocode, userPhone],
      );

      return promos[0] || null;
   }

   public async activatePromo(userPhone: string, promocode: string) {
      const checkResult = await this.checkPromo(userPhone, promocode);
   }

   private _call<T = unknown>(sql: string, args: any[]): Promise<T> {
      return new Promise((resolve, reject) => {
         this._pool.query(sql, args, (err, result) => {
            if (err !== null) {
               return reject(err);
            }
            return resolve(result);
         });
      });
   }
}