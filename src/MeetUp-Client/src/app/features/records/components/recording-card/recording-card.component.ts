import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Recording } from '../../services/recordings.service';

@Component({
  selector: 'app-recording-card',
  standalone: true,
  imports: [Card, Button, DatePipe],
  templateUrl: './recording-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordingCardComponent {
  recording = input.required<Recording>();
  playRecording = output<void>();
  share = output<void>();

  onPlay() {
    this.playRecording.emit();
  }

  onShare() {
    this.share.emit();
  }

  formattedDuration = computed(() => {
    const duration = this.recording().duration;
    if (!duration) return '--:--';

    // Basic TimeSpan parsing "HH:mm:ss" or "d.HH:mm:ss"
    // Assuming format like "00:00:00" or similar standard .NET serialization
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
      // Fallback parsing if needed, but standard TimeSpan is usually 3 parts
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
