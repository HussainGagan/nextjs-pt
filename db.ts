import { Database } from "@/types/index";
import { createPool } from "mysql2";
import { Kysely, MysqlDialect } from "kysely";

export const dialect = new MysqlDialect({
  pool: createPool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT as any,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
