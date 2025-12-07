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
      'Get Recording Url': props<{ recordingKey: string }>(),
      'Get Recording Url Success': props<{ url: string }>(),
      'Get Recording Url Failure': props<{ error: unknown }>(),
    },
  });
}
