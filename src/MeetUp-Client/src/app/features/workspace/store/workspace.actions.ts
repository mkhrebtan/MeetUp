import {createActionGroup, props} from '@ngrx/store';
import {Workspace} from '../models/workspace.model';

export const WorkspaceActions = createActionGroup({
  source: 'Workspace',
  events: {
    'Load Workspace': props<{ id: string; }>(),
    'Load Workspace Success': props<{ workspace: Workspace | null }>(),
    'Load Workspace Failure': props<{ error: string }>(),

    'Create Workspace': props<{ name: string }>(),
    'Create Workspace Success': props<{ workspace: Workspace }>(),
    'Create Workspace Failure': props<{ error: string }>(),

    'Join Workspace': props<{ inviteCode: string; }>(),
    'Join Workspace Success': props<{ workspace: Workspace }>(),
    'Join Workspace Failure': props<{ error: string }>(),
  },
});
