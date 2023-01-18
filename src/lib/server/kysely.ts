import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import type { KyselyLuciaDatabase } from "@lucia-auth/adapter-kysely";

export const db = new Kysely<KyselyLuciaDatabase>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: 'blah',
      database: 'blah',
    })
  })
});