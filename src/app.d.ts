// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type {Sql} from "postgres";

// and what to do when importing types
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			sql: Sql;
		}
		// interface PageData {}
		// interface Platform {}
	}
}
