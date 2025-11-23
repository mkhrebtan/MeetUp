import {provideState} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {appFeatureKey, appReducer} from './reducers/app.reducer';
import {AppEffects} from './effects/app.effects';


export const ROOT_STORE_PROVIDERS = [
  provideState(appFeatureKey, appReducer),

  provideEffects([AppEffects])
];
