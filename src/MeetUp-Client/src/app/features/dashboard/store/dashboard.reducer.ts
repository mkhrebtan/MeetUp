import { createFeature, createReducer, on } from '@ngrx/store';
import { MeetingModel } from '../models/meeting.model';
import { DashboardActions } from './dashboard.actions';
import { KpisModel } from '../models/kpis.model';

export interface DashboardState {
  loading: {
    kpis: boolean;
    meetings: boolean;
    records: boolean;
  };
  kpis: KpisModel;
  meetings: MeetingModel[];
  error: string | null;
}

export const initialState: DashboardState = {
  loading: {
    kpis: false,
    meetings: false,
    records: false,
  },
  kpis: {
    lastWeekMeetings: 0,
    lastWeekTotalHours: 0,
    totalMembers: 0,
  },
  meetings: [],
  error: null,
};

export const dashboardFeature = createFeature({
  name: 'dashboard',
  reducer: createReducer(
    initialState,
    on(DashboardActions.loadKpis, (state) => ({
      ...state,
      loading: { ...state.loading, kpis: true },
    })),
    on(DashboardActions.loadKpisSuccess, (state, { kpis }) => ({
      ...state,
      loading: { ...state.loading, kpis: false },
      kpis,
    })),
    on(DashboardActions.loadKpisFailure, (state, { error }) => ({
      ...state,
      loading: { ...state.loading, kpis: false },
      error,
    })),
  ),
});
