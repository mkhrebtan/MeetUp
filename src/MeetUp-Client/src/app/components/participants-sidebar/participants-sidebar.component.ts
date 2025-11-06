import {Component, input, output} from '@angular/core';
import {Participant} from 'livekit-client';
import {ScrollPanel} from 'primeng/scrollpanel';

@Component({
  selector: 'app-participants-sidebar',
  template: `
    <div
      class="h-full border border-neutral-700 bg-neutral-800 shadow-xl py-4 px-6 rounded-xl
                flex flex-col gap-4 overflow-y-auto text-white">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold">Participants ({{ participants().length }})</h2>
        <i class="pi pi-times cursor-pointer" (click)="onClose()"></i>
      </div>
      <p-scroll-panel class="h-full">
        <ul class="flex flex-col gap-2">
          @for (participant of participants(); track participant.identity) {
            <li class="bg-neutral-900/50 rounded-xl py-2 px-4">{{ participant.identity }}</li>
          }
        </ul>
      </p-scroll-panel>
    </div>
  `,
  styles: [],
  imports: [
    ScrollPanel
  ]
})
export class ParticipantsSidebarComponent {
  close = output();
  participants = input.required<Participant[]>();

  onClose() {
    this.close.emit();
  }
}
