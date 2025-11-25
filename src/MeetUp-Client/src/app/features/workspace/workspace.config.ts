import {provideState} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {workspaceReducer} from './store/workspace.reducer';
import {WorkspaceEffects} from './store/workspace.effects';

export const WORKSPACE_PROVIDERS = [
  provideState({name: 'workspace', reducer: workspaceReducer}),
  provideEffects(WorkspaceEffects),
];
