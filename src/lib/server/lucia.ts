import { DATABASE_CONNECTION_STRING } from '$env/static/private'
import lucia from 'lucia-auth'
import { default as kysely, type KyselyLuciaDatabase } from '@lucia-auth/adapter-kysely'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import { dev } from '$app/environment'

const db = new Kysely<KyselyLuciaDatabase>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: DATABASE_CONNECTION_STRING,
    }),
  }),
})

export const auth = lucia({
  adapter: kysely(db, 'pg'), // change "pg" to "mysql2", "better-sqlite3"
  env: dev ? 'DEV' : 'PROD',
  transformUserData: (userData) => {
    return {
      userId: userData.id,
      username: userData.username,
    }
  },
})

export type Auth = typeof auth
