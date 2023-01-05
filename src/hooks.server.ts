import postgres from 'postgres';
import type {Handle} from "@sveltejs/kit";
import {DATABASE_CONNECTION_STRING} from '$env/static/private';

export const handle = (async ({ event, resolve }) => {
	const sql = postgres(DATABASE_CONNECTION_STRING);
	
	event.locals = {
	  sql: sql
	};
	
	const response = await resolve(event);
	return response;
}) satisfies Handle;