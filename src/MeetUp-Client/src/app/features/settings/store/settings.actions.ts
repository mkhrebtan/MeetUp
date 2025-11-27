import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { WorkspaceSettings } from '../models/workspace-settings.model';

export const SettingsActions = createActionGroup({
  source: 'Settings',
  events: {
    UpdateSettings: props<{ settings: WorkspaceSettings }>(),
    UpdateSettingsSuccess: emptyProps(),
    UpdateSettingsFailure: props<{ error: string }>(),

    LeaveWorkspace: props<{ id: string }>(),
    LeaveWorkspaceSuccess: emptyProps(),
    LeaveWorkspaceFailure: props<{ error: string }>(),

    DeleteWorkspace: props<{ id: string }>(),
    DeleteWorkspaceSuccess: emptyProps(),
    DeleteWorkspaceFailure: props<{ error: string }>(),
  },
});
