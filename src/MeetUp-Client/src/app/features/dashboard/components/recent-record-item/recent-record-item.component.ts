import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RecentRecordModel } from '../../models/recent-record.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveWorkspaceId } from '../../../workspace/store/workspace.selectors';

@Component({
  selector: 'app-recent-record-item',
  imports: [DatePipe],
  templateUrl: './recent-record-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentRecordItemComponent {
  private router = inject(Router);
  private store = inject(Store);

  record = input.required<RecentRecordModel>();

  onRecordClick() {
    const workspaceId = this.store.selectSignal(selectActiveWorkspaceId)();
    if (workspaceId) {
      this.router.navigate(['/workspace', workspaceId, 'records']);
    }
  }

  formattedDuration = computed(() => {
    const duration = this.record().duration;
    if (!duration) return '--:--';

    // Basic TimeSpan parsing "HH:mm:ss" or "d.HH:mm:ss"
    const parts = duration.split(':');
    if (parts.length < 2) return '--:--';

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (parts.length === 3) {
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10);
      seconds = parseFloat(parts[2]);
    } else {
      return duration;
    }

    // Check for zero duration
    if (hours === 0 && minutes === 0 && seconds === 0) {
      return '--:--';
    }

    // Round to minutes
    if (seconds > 0) {
      minutes++;
      if (minutes === 60) {
        hours++;
        minutes = 0;
      }
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  });
}
