import { createFeature, createReducer, on } from '@ngrx/store';
import { Recording } from '../services/recordings.service';
import { RecordsActions } from './records.actions';

export interface RecordsState {
  recordings: Recording[];
  loading: boolean;
  error: unknown | null;
  playingUrl: string | null;
}

export const initialState: RecordsState = {
  recordings: [],
  loading: false,
  error: null,
  playingUrl: null,
};

export const recordsFeature = createFeature({
  name: 'records',
  reducer: createReducer(
    initialState,
    on(RecordsActions.actions.loadRecordings, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(RecordsActions.actions.loadRecordingsSuccess, (state, { recordings }) => ({
      ...state,
      recordings,
      loading: false,
    })),
    on(RecordsActions.actions.loadRecordingsFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),
    on(RecordsActions.actions.getRecordingUrl, (state) => ({
      ...state,
      playingUrl: null,
    })),
    on(RecordsActions.actions.getRecordingUrlSuccess, (state, { url }) => ({
      ...state,
      playingUrl: url,
    })),
  ),
});

export const { selectRecordings, selectLoading, selectError, selectPlayingUrl } = recordsFeature;
