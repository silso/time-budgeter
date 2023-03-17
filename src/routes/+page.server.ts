import type { Activity } from '$lib/model/domain/activity'
import {
  databaseToDomainTypeConverter,
  type SelectableActivityDatabase,
} from '$lib/server/model/database/kysely/v1/activity'
import { db } from '$lib/server/model/database/kysely/v1/database'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad<{ activities: Activity[] }> = async ({ params }) => {
  const activities: SelectableActivityDatabase = {
    compound_activity: await db.selectFrom('compound_activity').selectAll().execute(),
    fundamental_activity: await db.selectFrom('fundamental_activity').selectAll().execute(),
    activity_component: await db.selectFrom('activity_component').selectAll().execute(),
  }
  return { activities: databaseToDomainTypeConverter.convert(activities) }
}
