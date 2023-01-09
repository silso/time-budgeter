import _ from "lodash";

export type AbstractActivity = {
    id: number;
    name: string;
    value: number;
    description: string;
};

export type GenericActivity = AbstractActivity & {
    fundamental: false;
    components: Array<{
        weight: number;
        activityId: number;
    }>;
}

export type FundamentalActivity = AbstractActivity & {
    fundamental: true;
    components: undefined;
};

export type Activity = GenericActivity | FundamentalActivity;

// DATABASE TYPES

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

export function activitiesToActivitiesAndActivityComponentsRows(activities: Activity[]): [ActivitiesRow[], ActivityComponentsRow[]] {
    const [activitiesRows, activityComponentsRows] = _.chain(activities)
        .map(activity => [_.omit(activity, 'components'), activityToActivityComponentsRow(activity)])
        .unzip()
        .value() as [ActivitiesRow[], ActivityComponentsRow[]] // shouldn't need to do this
    return [activitiesRows, _.flatten(activityComponentsRows)]
}
