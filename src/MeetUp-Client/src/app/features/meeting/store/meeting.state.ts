import { Meeting } from '../models/meeting.model';

export interface MeetingState {
  meeting: Meeting | null;
  loading: boolean;
  error: string | null;
}

export const initialMeetingState: MeetingState = {
  meeting: null,
  loading: false,
  error: null,
};
