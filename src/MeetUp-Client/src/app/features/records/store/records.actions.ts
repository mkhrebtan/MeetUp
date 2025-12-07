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

      // Share Actions
      'Open Share Modal': props<{ recordingKey: string }>(),
      'Close Share Modal': emptyProps(),
      'Load Share Candidates': emptyProps(),
      'Load Share Candidates Success': props<{
        candidates: { id: string; fullName: string; avatarUrl?: string }[];
      }>(),
      'Load Share Candidates Failure': props<{ error: unknown }>(),
      'Share Recording': props<{ recipientIds: string[] }>(),
      'Share Recording Success': emptyProps(),
      'Share Recording Failure': props<{ error: unknown }>(),
    },
  });
}
