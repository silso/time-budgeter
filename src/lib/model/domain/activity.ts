// domain models for this app should be the same as frontend models due to two-way binding

import type { Insertable } from 'kysely'
import type { ActivityDatabase } from '$lib/server/model/database/kysely/v1/activity'
import { createTypeConverter } from '../type-converter'

export type ActivityId = string

export interface CompoundActivity {
  id: ActivityId
  name: string
  description: string
  activityComponents: Array<{
    weight: number
    activity: ActivityId
  }>
}

export interface FundamentalActivity {
  id: ActivityId
  name: string
  description: string
  value: number
}

export type Activity = CompoundActivity | FundamentalActivity

export type InsertableActivityDatabase = {
  [tableName in keyof ActivityDatabase]: Array<Insertable<ActivityDatabase[tableName]>>
}

export const domainToDatabaseTypeConverter = createTypeConverter<
  Array<Activity>,
  InsertableActivityDatabase
>((from) => {
  return {
    compound_activity: [{ name: '', description: '' }],
    fundamental_activity: [{ name: '', description: '', value: 0 }],
    activity_component: [{ weight: 0 }],
  }
})
