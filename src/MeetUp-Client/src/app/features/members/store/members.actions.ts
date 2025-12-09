import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { WorkspaceMember } from '../models/member.model';
import { PagedList } from '../models/paged-list.model';

export const MembersActions = createActionGroup({
  source: 'Members',
  events: {
    'Load Members': props<{
      workspaceId: string;
      page?: number;
      pageSize?: number;
      search?: string;
    }>(),
    'Load Members Success': props<{ pagedList: PagedList<WorkspaceMember> }>(),
    'Load Members Failure': props<{ error: string }>(),
    'Invite Members': props<{ workspaceId: string; emails: string[] }>(),
    'Invite Members Success': emptyProps(),
    'Invite Members Failure': props<{ error: string }>(),

    'Remove Member': props<{ workspaceId: string; email: string }>(),
    'Remove Member Success': emptyProps(),
    'Remove Member Failure': props<{ error: string }>(),

    'Update Member Role': props<{
      userId: string;
      role: string;
    }>(),
    'Update Member Role Success': props<{ userId: string; role: string }>(),
    'Update Member Role Failure': props<{ error: string }>(),
  },
});
