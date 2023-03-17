import { sql, type Kysely } from 'kysely'

// TODO: make these sensible constraints, figure out what the right types actually are, make sure UUIDs are being generated

export async function up(db: Kysely<any>): Promise<void> {
  console.log('up')
  await db.schema
    .createTable('compound_activity')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'text')
    .addColumn('description', 'text')
    .execute()

  await db.schema
    .createTable('fundamental_activity')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'text')
    .addColumn('description', 'text')
    .addColumn('value', 'numeric')
    .execute()

  await db.schema
    .createTable('activity_component')
    .addColumn('parent', 'uuid')
    .addColumn('child', 'uuid')
    .addColumn('weight', 'numeric')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('compound_activity').execute()
  await db.schema.dropTable('fundamental_activity').execute()
  await db.schema.dropTable('activity_component').execute()
}
