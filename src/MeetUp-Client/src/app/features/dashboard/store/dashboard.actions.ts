import { createActionGroup, emptyProps } from '@ngrx/store';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    Init: emptyProps(),
  },
});
