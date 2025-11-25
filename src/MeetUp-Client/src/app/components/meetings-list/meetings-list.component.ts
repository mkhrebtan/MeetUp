import { Component, inject } from '@angular/core';
import { MeetingService } from '../../features/meeting/services/meetings/meeting.service';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meetings-list',
  imports: [Button],
  template: `
    <div class="flex flex-col gap-4 items-center justify-center">
      @for (meeting of meetings; track meeting.id) {
        <div class="flex items-center gap-4 p-4 border border-gray-300 shadow-lg rounded-lg">
          <p>
            {{ meeting.name }}
          </p>
          <p-button label="Join" severity="info" (click)="joinMeeting(meeting.id)" />
        </div>
      }
    </div>
  `,
  styles: ``,
})
export class MeetingsListComponent {
  private router = inject(Router);
  private meetingService = inject(MeetingService);
  meetings = this.meetingService.getMeetings();

  joinMeeting(meetingId: string) {
    this.router.navigate(['/room', meetingId]);
  }
}
