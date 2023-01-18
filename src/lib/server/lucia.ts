import lucia from 'lucia-auth';
import { default as kysely, type KyselyLuciaDatabase } from "@lucia-auth/adapter-kysely";
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

const db = new Kysely<KyselyLuciaDatabase>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: 'blah',
      database: 'blah',
    })
  })
});

export const auth = lucia({
  adapter: kysely(db, "pg"), // change "pg" to "mysql2", "better-sqlite3"
  env: "DEV"
});

export type Auth = typeof auth;