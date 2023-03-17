import {
  databaseToDomainTypeConverter,
  type SelectableActivityDatabase,
} from '$lib/server/model/database/kysely/v1/activity'
import {
  domainToDatabaseTypeConverter,
  type InsertableActivityDatabase,
} from '$lib/model/domain/activity'
import type { RequestHandler } from '@sveltejs/kit'

export const GET = (async ({ locals }) => {
  const { db } = locals

  const activities: SelectableActivityDatabase = {
    compound_activity: await db.selectFrom('compound_activity').selectAll().execute(),
    fundamental_activity: await db.selectFrom('fundamental_activity').selectAll().execute(),
    activity_component: await db.selectFrom('activity_component').selectAll().execute(),
  }
  return new Response(JSON.stringify(databaseToDomainTypeConverter.convert(activities)))
}) satisfies RequestHandler

export const POST = (async ({ request, locals }) => {
  const { db } = locals
  const body = await request.json()
  console.log('received activities', body)

  const activities: InsertableActivityDatabase = domainToDatabaseTypeConverter.convert(body)

  console.log('received activities', activities)

  await db.insertInto('compound_activity').values(activities.compound_activity).execute()
  await db.insertInto('fundamental_activity').values(activities.fundamental_activity).execute()
  await db.insertInto('activity_component').values(activities.activity_component).execute()

  return new Response('bloh')
}) satisfies RequestHandler

//export const GET = () => {
//   const { sql } = locals

//   const activitiesRows = await sql<ActivitiesRow[]>`SELECT * FROM "Activities"`
//   const activityComponentsRows = await sql<
//     ActivityComponentsRow[]
//   >`SELECT * FROM "Activity Components"`

//   // Map from an activity ID to it's components
//   const activityComponents = new Map<number, { weight: number; activityId: number }[]>()

//   activityComponentsRows.forEach((component) => {
//     const existingComponents = activityComponents.get(component.parent) // components that have been found so far for this parent activity
//     activityComponents.set(
//       component.parent,
//       [...(existingComponents ?? []), { weight: component.weight, activityId: component.child }] // add this component to those found so far
//     )
//   })

//   const activities: Activity[] = activitiesRows.map((activity) => {
//     if (activity.fundamental) {
//       return {
//         ...activity,
//         fundamental: true,
//         components: undefined,
//       }
//     } else {
//       const components = activityComponents.get(activity.id) // if this activity is not fundamental, it must have components
//       if (components === undefined) throw new TypeError()
//       return {
//         ...activity,
//         fundamental: false,
//         components,
//       }
//     }
//   })
//   return new Response(JSON.stringify(activities)) // FIXME: prolly dont want to stringify
// }) satisfies RequestHandler

// export const POST = (async ({ request, locals }) => {
//   const { sql } = locals
//   const {
//     updatedActivitiesRows,
//     updatedActivityComponentsRows,
//     removedActivitiesRows,
//     removedActivityComponentsRows,
//   }: Endpoints['/activities']['post']['request'] = await request.json()

//   const result = await sql.begin((sql) => [
//     ...(updatedActivitiesRows.length === 0
//       ? []
//       : [
//           sql`
// 			INSERT INTO "Activities" ${sql(updatedActivitiesRows)}
// 			ON CONFLICT (id) DO UPDATE
// 				SET name = EXCLUDED.name,
// 					value = EXCLUDED.value,
// 					description = EXCLUDED.description,
// 					fundamental = EXCLUDED.fundamental
// 		`,
//         ]),
//     ...(updatedActivityComponentsRows.length === 0
//       ? []
//       : [
//           sql`
// 			INSERT INTO "Activity Components" ${sql(updatedActivityComponentsRows)}
// 			ON CONFLICT (parent, child) DO UPDATE
// 				SET weight = EXCLUDED.weight
// 		`,
//         ]),
//     // NOTE: these might not work at all
//     ...(removedActivitiesRows.length === 0
//       ? []
//       : [
//           sql`
// 			DELETE FROM "Activities"
// 			WHERE id IN ${sql(removedActivitiesRows)}
// 		`,
//         ]),
//     ...(removedActivityComponentsRows.length === 0
//       ? []
//       : [
//           sql`
// 			DELETE FROM "Activities"
// 			WHERE (parent, child) IN ${sql(removedActivityComponentsRows)}
// 		`,
//         ]),
//   ])

//   return new Response(JSON.stringify(result)) // FIXME: prolly dont want to stringify
// }) satisfies RequestHandler
