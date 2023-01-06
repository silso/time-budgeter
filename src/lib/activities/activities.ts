import type {Activity} from "$lib/stores/store"

export type ActivitiesRow = Omit<Activity, 'components'>

export type ActivityComponentsRow = {
	parent: number,
	child: number,
	weight: number
}

export function activityToActivityComponentsRow(activity: Activity) {
	return activity.components?.map(component => ({
		parent: activity.id,
		child: component.activityId,
		weight: component.weight
	})) ?? []
}