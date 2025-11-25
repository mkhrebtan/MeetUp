import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { MeetingModel } from '../models/meeting.model';
import { KpisModel } from '../models/kpis.model';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    LoadKpis: emptyProps(),
    LoadMeetings: emptyProps(),

    LoadKpisSuccess: props<{
      kpis: KpisModel;
    }>(),
    LoadMeetingsSuccess: props<{ meetings: MeetingModel[] }>(),

    LoadKpisFailure: props<{ error: string }>(),
    LoadMeetingsFailure: props<{ error: string }>(),
  },
});
