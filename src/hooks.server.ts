import type { Handle } from '@sveltejs/kit'
import { db, migrator } from '$lib/server/model/database/kysely/v1/database'

export const handle = (async ({ event, resolve }) => {
  migrator.migrateToLatest()

  event.locals = {
    db: db,
  }

  const response = await resolve(event)
  return response
}) satisfies Handle
