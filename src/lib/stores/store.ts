import { asyncWritable, writable, type Stores } from "@square/svelte-store";
import _ from 'lodash';
import {activityToActivityComponentsRow, type ActivitiesRow, type ActivityComponentsRow} from "$lib/activities/activities";
import type {Endpoints} from "$lib/api/types";

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

function activitiesToActivitiesAndActivityComponentsRows(activities: Activity[]): [ActivitiesRow[], ActivityComponentsRow[]] {
    const [activitiesRows, activityComponentsRows] = _.chain(activities)
        .map(activity => [_.omit(activity, 'components'), activityToActivityComponentsRow(activity)])
        .unzip()
        .value() as [ActivitiesRow[], ActivityComponentsRow[]] // shouldn't need to do this
    return [activitiesRows, _.flatten(activityComponentsRows)]
}

// For some reason the `oldValues` argument in the second asyncWritable callback was always exactly the same as new,
// So we're doing it manually
const oldActivitiesStore = writable<Activity[]>([]);
// This is used to debounce writing to the database
const writing = writable(false);

export const activities = asyncWritable<Stores, Activity[]>(
    [],
    async () => {
        const res = await fetch('/api/activities');
        const json = await res.json() as Endpoints['/activities']['get'];
        oldActivitiesStore.set(_.cloneDeep(json));
        return json;
    },
    async (newActivities) => {
        if (await writing.load()) return
        
        writing.set(true);
        setTimeout(async () => {
            const oldActivities = await oldActivitiesStore.load();
            
            const [newActivitiesRows, newActivityComponentsRows] = activitiesToActivitiesAndActivityComponentsRows(newActivities)
            const [oldActivitiesRows, oldActivityComponentsRows] = activitiesToActivitiesAndActivityComponentsRows(oldActivities)
            
            const updatedActivitiesRows = _.differenceWith(newActivitiesRows, oldActivitiesRows, _.isEqual)
            const removedActivitiesRows = _.differenceBy(oldActivitiesRows, newActivitiesRows, 'id')
            const updatedActivityComponentsRows = _.differenceWith(newActivityComponentsRows, oldActivityComponentsRows, _.isEqual)
            const removedActivityComponentsRows = _.differenceWith(
                oldActivityComponentsRows,
                newActivityComponentsRows,
                ((oldComponent, newComponent) => oldComponent.parent === newComponent.parent && oldComponent.child === newComponent.child)
            )
            
            // TODO: must only be new activities, all of these will be inserted into the database rn
            const postBody: Endpoints['/activities']['post']['request'] = {
                updatedActivitiesRows,
                updatedActivityComponentsRows,
                removedActivitiesRows,
                removedActivityComponentsRows
            };
            const response = await fetch('/api/activities', {
                method: 'POST',
                body: JSON.stringify(postBody),
            });
            // const result = await response.json();
            // TODO: check success/failure (could be solved with trpc-sveltekit)
            oldActivitiesStore.set(_.cloneDeep(newActivities));
            
            writing.set(false);
        }, 1000);
    }
);

activities.subscribe(val => {
    console.log('activities updated', val);
});