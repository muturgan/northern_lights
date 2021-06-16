import mysql = require('mysql');

interface IConnectionConfig extends mysql.ConnectionConfig {
   readonly host: string;
   readonly port: number;
   readonly user: string;
   readonly password: string;
   readonly database: string;
   readonly timezone: string;
}

export class MySQL {
   private readonly _conn: mysql.Connection;

   constructor(conf: IConnectionConfig) {
      this._conn = mysql.createConnection(conf);
   }

   public start(): Promise<void> {
      return new Promise<void>((resolve, reject) => {
         this._conn.connect((err) => {
            if (err) {
               return reject(err);
            }
            resolve();
         });
      });
   }

   public stop(): Promise<void> {
      return new Promise<void>((resolve, reject) => {
         this._conn.end((err) => {
            if (err) {
               return reject(err);
            }
            resolve();
         });
      });
   }
}