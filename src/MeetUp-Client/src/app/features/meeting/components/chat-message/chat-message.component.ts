import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="flex flex-col gap-1 w-fit" [class.justify-self-end]="isLocalParticipant()">
      <div class="flex items-baseline gap-2" [class.flex-row-reverse]="isLocalParticipant()">
        <span class="text-sm font-bold">{{ sender() }}</span>
        <span class="text-xs text-neutral-400">{{ timestamp() | date: 'shortTime' }}</span>
      </div>
      <div
        class="max-w-xs sm:max-w-sm md:max-w-md rounded-lg px-3 py-2 text-white w-fit"
        [class.bg-blue-600]="isLocalParticipant()"
        [class.bg-neutral-700]="!isLocalParticipant()"
        [class.self-end]="isLocalParticipant()"
      >
        <p class="break-words">{{ message() }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessageComponent {
  message = input.required<string>();
  sender = input.required<string>();
  timestamp = input.required<Date>();
  isLocalParticipant = input.required<boolean>();
}
