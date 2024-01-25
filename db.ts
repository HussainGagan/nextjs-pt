import { Database } from "@/types/index";
import { createPool } from "mysql2";
import { Kysely, MysqlDialect } from "kysely";

export const dialect = new MysqlDialect({
  pool: createPool({
    database: "prod_db",
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
