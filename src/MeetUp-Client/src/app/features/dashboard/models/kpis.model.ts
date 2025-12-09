import { KpiStatModel } from './kpi-stat.model';

export interface KpisModel {
  lastWeekMeetings: KpiStatModel;
  lastWeekTotalHours: KpiStatModel;
  totalMembers: KpiStatModel;
}
