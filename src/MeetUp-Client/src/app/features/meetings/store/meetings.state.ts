import { Meeting } from '../models/meeting.model';

export interface MeetingsState {
  hostedMeetings: Meeting[];
  invitedMeetings: Meeting[];
  loading: boolean;
  error: string | null;
}

export const initialState: MeetingsState = {
  hostedMeetings: [],
  invitedMeetings: [],
  loading: false,
  error: null,
};
