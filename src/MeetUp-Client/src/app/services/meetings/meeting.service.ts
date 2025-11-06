import {Injectable} from '@angular/core';
import {Meeting} from '../../models/meeting';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private meetings: Meeting[] = [
    {id: '1', name: 'Meeting 1'},
    {id: '2', name: 'Meeting 2'},
  ];

  getMeetings(): Meeting[] {
    return this.meetings;
  }

  getMeetingById(id: string): Meeting | undefined {
    return this.meetings.find(meeting => meeting.id === id);
  }
}
