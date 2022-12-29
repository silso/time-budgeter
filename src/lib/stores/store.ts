import { writable } from "svelte/store";

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

export const activities = writable<Activity[]>(
    [
        {
            id: 0,
            fundamental: false,
            name: 'specific activity',
            value: 0,
            description: '',
            components: [
                {
                    weight: 0.5,
                    activityId: 1,
                },
                {
                    weight: 0.25,
                    activityId: 2,
                },
            ]
        },
        {
            id: 1,
            fundamental: true,
            name: 'general activity 1',
            value: 2,
            description: '',
            components: undefined,
        },
        {
            id: 2,
            fundamental: true,
            name: 'general activity 2',
            value: 5,
            description: '',
            components: undefined,
        },
    ]
);

activities.subscribe(val => {
    console.log('activities updated', val);
});