import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { MeetingModel } from '../../models/meeting.model';

@Component({
  selector: 'app-upcoming-meeting-item',
  imports: [DatePipe, Button],
  templateUrl: './upcoming-meeting-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingMeetingItemComponent {
  meeting = input.required<MeetingModel>();

  getDuration(minutes: number): string {
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}min`;
    }
    return `${minutes}min`;
  }
}
