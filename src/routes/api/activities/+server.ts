import type {Activity} from '$lib/stores/store';
import type { RequestHandler } from '@sveltejs/kit';
import type {ActivitiesRow, ActivityComponentsRow} from '$lib/activities/activities';

export const GET = (async ({ locals }) => {
	const { sql } = locals;
	
	const activitiesRows = await sql<ActivitiesRow[]>`SELECT * FROM "Activities"`;
	const activityComponentsRows = await sql<ActivityComponentsRow[]>`SELECT * FROM "Activity Components"`;
	
	const activityComponents = new Map<number, {weight: number, activityId: number}[]>();
	
	activityComponentsRows.forEach(component => {
		const existingComponents = activityComponents.get(component.parent)
		activityComponents.set(
			component.parent,
			[...existingComponents ?? [], {weight: component.weight, activityId: component.child}]
		)
	});
	
	const activities: Activity[] = activitiesRows.map(activity => {
		if (activity.fundamental) {
			return {
				...activity,
				fundamental: true,
				components: undefined
			}
		} else {
			const components = activityComponents.get(activity.id);
			if (components === undefined) throw new TypeError;
			return {
				...activity,
				fundamental: false,
				components
			}
		}
	})
	return new Response(JSON.stringify(activities)); // FIXME: prolly dont want to stringify
}) satisfies RequestHandler;

export const POST = (async ({ request, locals }) => {
	const req = await request.json();
	const {
		updatedActivitiesRows,
		updatedActivityComponentsRows,
		removedActivitiesRows,
		removedActivityComponentsRows
	}: {
		updatedActivitiesRows: ActivitiesRow[],
		updatedActivityComponentsRows: ActivityComponentsRow[],
		removedActivitiesRows: ActivitiesRow[],
		removedActivityComponentsRows: ActivityComponentsRow[]
	} = req;
	const { sql } = locals;
	
	const result = await sql.begin(sql => [
		...(updatedActivitiesRows.length === 0) ? [] : [sql`
			INSERT INTO "Activities" ${
				sql(updatedActivitiesRows)
			}
			ON CONFLICT (id) DO UPDATE
				SET name = EXCLUDED.name,
					value = EXCLUDED.value,
					description = EXCLUDED.description,
					fundamental = EXCLUDED.fundamental
		`],
		...(updatedActivityComponentsRows.length === 0) ? [] : [sql`
			INSERT INTO "Activity Components" ${
				sql(updatedActivityComponentsRows)
			}
			ON CONFLICT (parent, child) DO UPDATE
				SET weight = EXCLUDED.weight
		`],
		// NOTE: these might not work at all
		...(removedActivitiesRows.length === 0) ? [] : [sql`
			DELETE FROM "Activities"
			WHERE id IN ${sql(removedActivitiesRows)}
		`],
		...(removedActivityComponentsRows.length === 0) ? [] : [sql`
			DELETE FROM "Activities"
			WHERE (parent, child) IN ${sql(removedActivityComponentsRows)}
		`]
	])
	
	
	return new Response(JSON.stringify(result)); // FIXME: prolly dont want to stringify
}) satisfies RequestHandler;