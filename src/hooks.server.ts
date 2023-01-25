import { DATABASE_CONNECTION_STRING } from '$env/static/private'
import { auth } from '$lib/server/lucia'
import { handleHooks } from '@lucia-auth/sveltekit'
import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import postgres from 'postgres'

const dbHandle = (async ({ event, resolve }) => {
  const sql = postgres(DATABASE_CONNECTION_STRING, {
    types: {
      // By default, postgres.js converts numeric to string. This uses Number
      numeric: {
        to: 0,
        from: [1700],
        serialize: (x: string) => '' + x,
        parse: (x: number) => +x,
      },
    },
  })

  event.locals = {
    ...event.locals,
    sql: sql,
  }

  const response = await resolve(event)
  return response
}) satisfies Handle

export const handle = sequence(handleHooks(auth) as never satisfies Handle, dbHandle)
