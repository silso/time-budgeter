import { DATABASE_CONNECTION_STRING } from '$env/static/private'
import { Kysely, Migrator, PostgresDialect, type Insertable } from 'kysely'
import { Pool } from 'pg'
import type { ActivityDatabase } from './activity'
import { down, up } from './migrator'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Database extends ActivityDatabase {}

export type InsertableDatabase = {
  [TableName in keyof Database]: Array<Insertable<Database[TableName]>>
}

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: DATABASE_CONNECTION_STRING,
    }),
  }),
})

export const migrator = new Migrator({
  db: db,
  provider: {
    getMigrations: async () => ({
      v1: {
        up,
        down,
      },
    }),
  },
})
