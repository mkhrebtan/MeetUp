import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Workspace } from '../models/workspace.model';
import { Invitation } from '../models/invitation.model';

export const WorkspaceActions = createActionGroup({
  source: 'Workspace',
  events: {
    'Load Workspace': props<{ id: string }>(),
    'Load Workspace Success': props<{ workspace: Workspace | null }>(),
    'Load Workspace Failure': props<{ error: string }>(),

    'Load Invitations': emptyProps(),
    'Load Invitations Success': props<{ invitations: Invitation[] }>(),
    'Load Invitations Failure': props<{ error: string }>(),
    
    'Create Workspace': props<{ name: string }>(),
    'Create Workspace Success': props<{ workspace: Workspace }>(),
    'Create Workspace Failure': props<{ error: string }>(),

    'Join Workspace': props<{ inviteCode: string }>(),
    'Join Workspace Success': props<{ workspace: Workspace }>(),
    'Join Workspace Failure': props<{ error: string }>(),

    'Update Settings': props<{
      id: string;
      name: string;
      invitationPolicy: string;
      meetingsCreationPolicy: string;
    }>(),
    'Update Settings Success': props<{
      name: string;
      invitationPolicy: string;
      meetingsCreationPolicy: string;
    }>(),
    'Update Settings Failure': props<{ error: string }>(),

    'Leave Workspace': props<{ id: string }>(),
    'Leave Workspace Success': props<{ id: string }>(),
    'Leave Workspace Failure': props<{ error: string }>(),

    'Delete Workspace': props<{ id: string }>(),
    'Delete Workspace Success': props<{ id: string }>(),
    'Delete Workspace Failure': props<{ error: string }>(),
  },
});

