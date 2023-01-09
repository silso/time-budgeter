import postgres from 'postgres';
import type {Handle} from "@sveltejs/kit";
import {DATABASE_CONNECTION_STRING} from '$env/static/private';

export const handle = (async ({ event, resolve }) => {
	const sql = postgres(
		DATABASE_CONNECTION_STRING,
		{
			types: {
				// By default, postgres.js converts numeric to string. This uses Number
				numeric: {
					to: 0,
					from: [1700],
					serialize: (x: string) => "" + x,
					parse: (x: number) => +x,
				},
			}
		});
	
	event.locals = {
	  sql: sql
	};
	
	const response = await resolve(event);
	return response;
}) satisfies Handle;