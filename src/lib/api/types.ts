// TODO: replace with trpc https://github.com/icflorescu/trpc-sveltekit

import type { ActivitiesRow, Activity, ActivityComponentsRow } from '$lib/activities/activities'

export enum Message {
  Request = 'request',
  Response = 'response',
}

export enum RequestType {
  GET = 'get',
  POST = 'post',
}

export type Endpoints = {
  '/activities': {
    [RequestType.GET]: Activity[]
    [RequestType.POST]: {
      [Message.Request]: {
        updatedActivitiesRows: ActivitiesRow[]
        updatedActivityComponentsRows: ActivityComponentsRow[]
        removedActivitiesRows: ActivitiesRow[]
        removedActivityComponentsRows: ActivityComponentsRow[]
      }
    }
  }
}
