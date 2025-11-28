import { createActionGroup, props } from '@ngrx/store';
import { CreateMeetingRequest, Meeting, PagedList } from '../models/meeting.model';

export const MeetingsActions = createActionGroup({
  source: 'Meetings',
  events: {
    'Load Hosted Meetings': props<{
      workspaceId: string;
      page?: number;
      pageSize?: number;
      searchTerm?: string;
      passed?: boolean;
    }>(),
    'Load Hosted Meetings Success': props<{ meetings: PagedList<Meeting> }>(),
    'Load Hosted Meetings Failure': props<{ error: string }>(),

    'Load Invited Meetings': props<{
      workspaceId: string;
      page?: number;
      pageSize?: number;
      searchTerm?: string;
      passed?: boolean;
    }>(),
    'Load Invited Meetings Success': props<{ meetings: PagedList<Meeting> }>(),
    'Load Invited Meetings Failure': props<{ error: string }>(),

    'Join Meeting': props<{ inviteCode: string }>(),
    'Join Meeting Success': props<{ message: string }>(),
    'Join Meeting Failure': props<{ error: string }>(),

    'Create Meeting': props<{ request: CreateMeetingRequest }>(),
    'Create Meeting Success': props<{ message: string }>(),
    'Create Meeting Failure': props<{ error: string }>(),

    'Delete Meeting': props<{ meetingId: string; workspaceId: string }>(),
    'Delete Meeting Success': props<{ message: string }>(),
    'Delete Meeting Failure': props<{ error: string }>(),

    'Leave Meeting': props<{ meetingId: string; workspaceId: string }>(),
    'Leave Meeting Success': props<{ message: string }>(),
    'Leave Meeting Failure': props<{ error: string }>(),
  },
});
