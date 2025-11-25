import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-upcoming-meeting-skeleton',
  imports: [Skeleton],
  template: `
    <div class="flex items-center justify-between p-4 rounded-lg border border-border">
      <div class="flex-1 space-y-3">
        <p-skeleton width="60%" height="1.25rem" />
        <div class="flex items-center gap-4">
          <p-skeleton width="8rem" height="0.875rem" />
          <p-skeleton width="4rem" height="0.875rem" />
          <p-skeleton width="3rem" height="0.875rem" />
        </div>
      </div>
      <p-skeleton width="4rem" height="2rem" borderRadius="0.375rem" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingMeetingSkeletonComponent {}
