import {Component, input, InputSignal, output} from '@angular/core';
import {ScrollPanel} from 'primeng/scrollpanel';
import {Textarea, TextareaModule} from 'primeng/textarea';
import {Button} from 'primeng/button';
import {ChatMessageComponent} from '../chat-message/chat-message.component';
import {FormsModule} from '@angular/forms';

export interface MeetingChatMessage {
  message: string;
  sender: string;
  timestamp: Date;
  isLocalParticipant: boolean;
}

@Component({
  selector: 'app-meeting-chat',
  standalone: true,
  imports: [
    ScrollPanel,
    TextareaModule,
    Button,
    Textarea,
    ChatMessageComponent,
    FormsModule
  ],
  template: `
    <div
      class="h-full border border-neutral-700 bg-neutral-800 shadow-xl py-4 px-6 rounded-xl
                flex flex-col gap-4 text-white">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold">Chat</h2>
        <i class="pi pi-times cursor-pointer" (click)="onClose()"></i>
      </div>
      <p-scroll-panel class="flex-auto min-h-0">
        <div class="flex flex-col gap-4 px-4">
          @for (msg of messages(); track msg) {
            <app-chat-message
              [message]="msg.message"
              [sender]="msg.sender"
              [timestamp]="msg.timestamp"
              [isLocalParticipant]="msg.isLocalParticipant"
              class="animate-fadein"
            />
          }
        </div>
      </p-scroll-panel>
      <div class="flex items-start gap-2">
        <textarea rows="1" [autoResize]="true" class="flex-auto" pTextarea [(ngModel)]="messageText"></textarea>
        <p-button icon="pi pi-send" severity="secondary" [disabled]="!messageText"
                  (click)="onMessageSend(messageText)"></p-button>
      </div>
    </div>
  `,
})
export class MeetingRoomChatComponent {
  messages: InputSignal<MeetingChatMessage[]> = input.required();
  close = output();
  messageSend = output<string>();

  messageText: string = '';

  onClose() {
    this.close.emit();
  }

  onMessageSend(message: string) {
    this.messageSend.emit(message);
    this.messageText = '';
  }
}
