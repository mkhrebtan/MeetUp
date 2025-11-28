import { Workspace } from '../models/workspace.model';
import { Invitation } from '../models/invitation.model';

export interface WorkspaceState {
  activeWorkspace: Workspace | null;
  invitations: Invitation[];
  loading: {
    create: boolean;
    workspace: boolean;
    join: boolean;
    settings: boolean;
    invitations: boolean;
  };
  error: {
    create: string | null;
    workspace: string | null;
    join: string | null;
    settings: string | null;
    invitations: string | null;
  };
}

export const initialState: WorkspaceState = {
  activeWorkspace: null,
  invitations: [],
  loading: {
    create: false,
    workspace: false,
    join: false,
    settings: false,
    invitations: false,
  },
  error: {
    create: null,
    workspace: null,
    join: null,
    settings: null,
    invitations: null,
  },
};
