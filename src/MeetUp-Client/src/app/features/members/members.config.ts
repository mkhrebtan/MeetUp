import { Provider, EnvironmentProviders } from '@angular/core';

import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { membersReducer } from './store/members.reducer';
import { MembersEffects } from './store/members.effects';

export const MEMBERS_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideState('members', membersReducer),
  provideEffects(MembersEffects),
];
