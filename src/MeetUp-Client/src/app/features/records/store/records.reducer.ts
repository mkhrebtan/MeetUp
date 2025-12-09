import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Recording } from '../services/recordings.service';
import { RecordsActions, RecordsFilter } from './records.actions';

export interface RecordsState {
  userRecordings: Recording[];
  sharedRecordings: Recording[];
  filter: RecordsFilter;
  loading: boolean;
  error: unknown | null;
  playingUrl: string | null;

  // Share State
  shareModalVisible: boolean;
  shareRecordingKey: string | null;
  shareCandidates: { id: string; fullName: string; avatarUrl?: string }[];
  shareLoading: boolean;
  shareError: unknown | null;
}

export const initialState: RecordsState = {
  userRecordings: [],
  sharedRecordings: [],
  filter: 'ALL',
  loading: false,
  error: null,
  playingUrl: null,
  shareModalVisible: false,
  shareRecordingKey: null,
  shareCandidates: [],
  shareLoading: false,
  shareError: null,
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
      userRecordings: recordings,
      loading: false,
    })),
    on(RecordsActions.actions.loadRecordingsFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),
    on(RecordsActions.actions.loadSharedRecordings, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(RecordsActions.actions.loadSharedRecordingsSuccess, (state, { recordings }) => ({
      ...state,
      sharedRecordings: recordings,
      loading: false,
    })),
    on(RecordsActions.actions.loadSharedRecordingsFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),
    on(RecordsActions.actions.setFilter, (state, { filter }) => ({
      ...state,
      filter,
    })),
    on(RecordsActions.actions.getRecordingUrl, (state) => ({
      ...state,
      playingUrl: null,
    })),
    on(RecordsActions.actions.getRecordingUrlSuccess, (state, { url }) => ({
      ...state,
      playingUrl: url,
    })),

    // Share Actions
    on(RecordsActions.actions.openShareModal, (state, { recordingKey }) => ({
      ...state,
      shareModalVisible: true,
      shareRecordingKey: recordingKey,
      shareCandidates: [],
      shareError: null,
    })),
    on(RecordsActions.actions.closeShareModal, (state) => ({
      ...state,
      shareModalVisible: false,
      shareRecordingKey: null,
    })),
    on(RecordsActions.actions.loadShareCandidates, (state) => ({
      ...state,
      shareLoading: true,
      shareError: null,
    })),
    on(RecordsActions.actions.loadShareCandidatesSuccess, (state, { candidates }) => ({
      ...state,
      shareLoading: false,
      shareCandidates: candidates,
    })),
    on(RecordsActions.actions.loadShareCandidatesFailure, (state, { error }) => ({
      ...state,
      shareLoading: false,
      shareError: error,
    })),
    on(RecordsActions.actions.shareRecording, (state) => ({
      ...state,
      shareLoading: true,
      shareError: null,
    })),
    on(RecordsActions.actions.shareRecordingSuccess, (state) => ({
      ...state,
      shareLoading: false,
      shareModalVisible: false,
      shareRecordingKey: null,
    })),
    on(RecordsActions.actions.shareRecordingFailure, (state, { error }) => ({
      ...state,
      shareLoading: false,
      shareError: error,
    })),
  ),
  extraSelectors: ({ selectUserRecordings, selectSharedRecordings, selectFilter }) => ({
    selectRecordings: createSelector(
      selectUserRecordings,
      selectSharedRecordings,
      selectFilter,
      (userRecordings, sharedRecordings, filter) => {
        switch (filter) {
          case 'MY':
            return userRecordings;
          case 'SHARED':
            return sharedRecordings;
          case 'ALL':
          default:
            // Combine and probably sort?
            // Assuming we want to show all. We can sort by createdAt descending if not already sorted.
            // For now, just concatenate.
            return [...userRecordings, ...sharedRecordings].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );
        }
      },
    ),
  }),
});

export const {
  selectUserRecordings,
  selectSharedRecordings,
  selectFilter,
  selectRecordings,
  selectLoading,
  selectError,
  selectPlayingUrl,
  selectShareModalVisible,
  selectShareRecordingKey,
  selectShareCandidates,
  selectShareLoading,
  selectShareError,
} = recordsFeature;
