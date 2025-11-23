import { createAction, emptyProps, props } from '@ngrx/store';

export const AppInit = createAction(
  '[App Component] Init',
);

export const AppInitialized = createAction(
  '[App Component] Initialized',
);
