// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

import type { Sql } from 'postgres'
declare global {
  /// <reference types="lucia-auth" />
  declare namespace Lucia {
    type Auth = import('$lib/server/lucia').Auth
    type UserAttributes = {
      username: string
    }
  }
  namespace App {
    // interface Error {}
    interface Locals {
      sql: Sql
      validate: import('@lucia-auth/sveltekit').Validate
      validateUser: import('@lucia-auth/sveltekit').ValidateUser
      setSession: import('@lucia-auth/sveltekit').SetSession
    }
    // interface PageData {}
    // interface Platform {}
  }
}
