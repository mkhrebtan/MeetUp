import { createSelector } from '@ngrx/store';
import { dashboardFeature, DashboardState } from './dashboard.reducer';

export const { selectDashboardState } = dashboardFeature;

export const selectKpis = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.kpis,
);

export const selectMeetings = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.meetings,
);

export const selectRecords = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.records,
);

export const selectError = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.error,
);

export const selectLoading = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.loading,
);

export const selectKpisLoading = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.loading.kpis,
);

export const selectMeetingsLoading = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.loading.meetings,
);

export const selectRecordsLoading = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.loading.records,
);
