// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

import type { Database } from '$lib/server/model/database/kysely/v1/database'
import type { Kysely } from 'kysely'
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      db: Kysely<Database>
    }
    // interface PageData {}
    // interface Platform {}
  }
}
