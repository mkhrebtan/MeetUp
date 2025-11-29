import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Meeting } from '../../meeting/models/meeting.model';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private apiService = inject(ApiService);

  getRoomToken(meetingId: string) {
    return this.apiService.post<{ accessToken: string }>(`livekit/token/${meetingId}`, {});
  }

  getMeeting(meetingId: string) {
    return this.apiService.get<Meeting>(`meeting/${meetingId}`);
  }
}
