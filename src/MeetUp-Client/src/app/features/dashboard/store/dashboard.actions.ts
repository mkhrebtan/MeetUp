import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { MeetingModel } from '../models/meeting.model';
import { KpisModel } from '../models/kpis.model';
import { RecentRecordModel } from '../models/recent-record.model';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    LoadKpis: emptyProps(),
    LoadMeetings: emptyProps(),
    LoadRecords: emptyProps(),

    LoadKpisSuccess: props<{
      kpis: KpisModel;
    }>(),
    LoadMeetingsSuccess: props<{ meetings: MeetingModel[] }>(),
    LoadRecordsSuccess: props<{ records: RecentRecordModel[] }>(),

    LoadKpisFailure: props<{ error: string }>(),
    LoadMeetingsFailure: props<{ error: string }>(),
    LoadRecordsFailure: props<{ error: string }>(),
  },
});
