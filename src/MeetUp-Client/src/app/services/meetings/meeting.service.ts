import {Injectable} from '@angular/core';
import {MeetingModel} from '../../models/meeting.model';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private meetings: MeetingModel[] = [
    {id: '1', name: 'MeetingModel 1'},
    {id: '2', name: 'MeetingModel 2'},
  ];

  getMeetings(): MeetingModel[] {
    return this.meetings;
  }

  getMeetingById(id: string): MeetingModel | undefined {
    return this.meetings.find(meeting => meeting.id === id);
  }
}
