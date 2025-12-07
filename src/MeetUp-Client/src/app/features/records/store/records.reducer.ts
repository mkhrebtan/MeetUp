import { createFeature, createReducer, on } from '@ngrx/store';
import { Recording } from '../services/recordings.service';
import { RecordsActions } from './records.actions';

export interface RecordsState {
  recordings: Recording[];
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
  recordings: [],
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
});

export const {
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
