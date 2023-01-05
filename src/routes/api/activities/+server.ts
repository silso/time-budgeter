import type {Activity} from '$lib/stores/store';
import type { RequestHandler } from '@sveltejs/kit';

type ActivitiesRow = Omit<Activity, 'components'>

type ActivityComponentsRow = {
	parent: number,
	child: number,
	weight: number
}

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
	const { newActivities, removedActivities }: { newActivities: Activity[], removedActivities: Activity[] } = await request.json();
	const { sql } = locals;
	
	const newActivitiesRows = newActivities.map(activity => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { components, ...activityWithoutComponents } = activity;
		return activityWithoutComponents;
	})
	
	const newActivityComponentsRows = newActivities.flatMap(activity => {
		return activity.components?.map(component => ({
			parent: activity.id,
			child: component.activityId,
			weight: component.weight
		})) ?? []
	})
	
	const result = await sql`
		INSERT INTO "Activities" ${
			sql(newActivitiesRows)
		}
		ON CONFLICT (id) DO UPDATE
			SET name = EXCLUDED.name,
				value = EXCLUDED.value,
				description = EXCLUDED.description,
				fundamental = EXCLUDED.fundamental
	`
	const result2 = await sql`
		INSERT INTO "Activity Components" ${
			sql(newActivityComponentsRows)
		}
		ON CONFLICT (parent, child) DO UPDATE
			SET weight = EXCLUDED.weight
	`;
	
	const removedActivitiesRows = removedActivities.map(activity => activity.id)
	
	const removedActivityComponentsRows = removedActivities.flatMap(activity => {
		return activity.components?.map(component => ({
			parent: activity.id,
			child: component.activityId
		})) ?? []
	})
	
	const result3 = await sql`
		DELETE FROM "Activities"
		WHERE id IN ${sql(removedActivitiesRows)}
	`
	
	const result4 = await sql`
	DELETE FROM "Activities"
	WHERE (parent, child) IN ${sql(removedActivityComponentsRows)}
	`
	
	return new Response(JSON.stringify(result)); // FIXME: prolly dont want to stringify
}) satisfies RequestHandler;