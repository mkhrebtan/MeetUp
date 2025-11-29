import { Provider, EnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { meetingReducer } from './store/meeting.reducer';
import { MeetingEffects } from './store/meeting.effects';

export const MEETING_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideState('meeting', meetingReducer),
  provideEffects(MeetingEffects),
];
