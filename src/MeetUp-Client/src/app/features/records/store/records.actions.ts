import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Recording } from '../services/recordings.service';

export class RecordsActions {
  public static readonly prefix = '[Records]';

  public static readonly actions = createActionGroup({
    source: RecordsActions.prefix,
    events: {
      'Load Recordings': emptyProps(),
      'Load Recordings Success': props<{ recordings: Recording[] }>(),
      'Load Recordings Failure': props<{ error: unknown }>(),
    },
  });
}
