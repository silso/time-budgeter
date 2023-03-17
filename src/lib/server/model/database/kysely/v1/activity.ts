import type * as Domain from '$lib/model/domain/activity'
import { createTypeConverter } from '$lib/model/type-converter'
import type { Generated, Selectable } from 'kysely'

// UUID
type ActivityId = Generated<string>

export interface CompoundActivity {
  id: ActivityId
  name: string
  description: string
}

export interface ActivityFacet {
  id: ActivityId
  name: string
  description: string
  value: number
}

export interface ActivityComponent {
  parent: ActivityId
  child: ActivityId
  weight: number
}

export type ActivityDatabase = {
  compound_activity: CompoundActivity
  fundamental_activity: ActivityFacet
  activity_component: ActivityComponent
}

export type SelectableActivityDatabase = {
  [tableName in keyof ActivityDatabase]: Array<Selectable<ActivityDatabase[tableName]>>
}

export const databaseToDomainTypeConverter = createTypeConverter<
  SelectableActivityDatabase,
  Array<Domain.Activity>
>((from) => {
  const activityComponents = new Map<
    Domain.ActivityId,
    Domain.CompoundActivity['activityComponents']
  >()
  for (const component of from.activity_component) {
    const existingComponents = activityComponents.get(component.parent)
    activityComponents.set(component.parent, [
      ...(existingComponents ?? []),
      {
        weight: component.weight,
        activity: component.child,
      },
    ])
  }

  const activities: Array<Domain.Activity> = []
  for (const activity of from.compound_activity) {
    activities.push({
      ...activity,
      activityComponents: activityComponents.get(activity.id) ?? [],
    })
  }
  for (const activity of from.fundamental_activity) {
    const newActivity: Domain.ActivityFacet = {
      ...activity,
    }
    activities.push(newActivity)
  }

  return activities
})
