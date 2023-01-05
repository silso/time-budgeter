import { asyncWritable, type Stores } from "@square/svelte-store";

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

export const activities = asyncWritable<Stores, Activity[]>(
    [],
    async () => {
        const res = await fetch('/api/activities');
        console.log(res)
        return res.json();
    },
    async (newActivities, _parentValues, oldActivities) => {
        console.log(newActivities, oldActivities);
        // const newActivities = oldActivities?.filter(activity =>);
        
        // TODO: must only be new activities, all of these will be inserted into the database rn
        const postBody = JSON.stringify({ newActivities, newActivityComponents, removedActivities, removedActivityComponents });
        const response = await fetch('/api/activities', {
            method: 'POST',
            body: postBody,
        });
        return response.json();
    }
);

activities.subscribe(val => {
    console.log('activities updated', val);
});