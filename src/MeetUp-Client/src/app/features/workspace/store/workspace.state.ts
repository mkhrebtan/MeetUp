import { Workspace } from '../models/workspace.model';

export interface WorkspaceState {
  activeWorkspace: Workspace | null;
  loading: {
    create: boolean;
    workspace: boolean;
    join: boolean;
  };
  error: {
    create: string | null;
    workspace: string | null;
    join: string | null;
  };
}

export const initialState: WorkspaceState = {
  activeWorkspace: null,
  loading: {
    create: false,
    workspace: false,
    join: false,
  },
  error: {
    create: null,
    workspace: null,
    join: null,
  },
};
