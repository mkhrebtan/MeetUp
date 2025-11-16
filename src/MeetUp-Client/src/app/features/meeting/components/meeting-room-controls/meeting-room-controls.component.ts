import {Component, computed, input, output, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Button} from 'primeng/button';
import {SplitButton} from 'primeng/splitbutton';
import {DevicesModel} from '../../models/devices.model';
import {DevicesMenuItemsModel} from '../../models/devices-menu-items.model';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faMessage} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-meeting-room-controls',
  standalone: true,
  imports: [CommonModule, Button, SplitButton, FaIconComponent],
  template: `
    <section class="grid grid-cols-3 items-center gap-2 px-4">
      <div class="flex gap-2 w-fit h-full">
        <p-split-button dropdownIcon="pi pi-chevron-up before:text-xs"
                        (onClick)="onAudioToggle()"
                        [severity]="isMicrophoneEnabled() ? 'secondary' : 'danger'"
                        [model]="devicesMenuItems().audioInputs_Outputs">
          <ng-template #content>
            <i class="pi pi-microphone px-1 before:text-lg"></i>
          </ng-template>
        </p-split-button>
        <p-split-button dropdownIcon="pi pi-chevron-up before:text-xs"
                        (onClick)="onVideoToggle()"
                        [severity]="isVideoEnabled() ? 'secondary' : 'danger'"
                        [model]="devicesMenuItems().videoInputs">
          <ng-template #content>
            <i class="pi pi-video px-1 before:text-lg"></i>
          </ng-template>
        </p-split-button>
      </div>

      <div class="flex justify-center gap-2">
        <p-button icon="pi pi-users" size="large"
                  [severity]="isParticipantsSidebarVisible() ? 'contrast' : 'secondary'"
                  (click)="onParticipantsToggle()"/>
        <p-button icon="pi pi-desktop" size="large" severity="secondary" (click)="onScreenShareToggle()"/>
        <p-button icon="pi pi-stop-circle" size="large" severity="secondary" (click)="onRecordingToggle()"/>
        <p-button size="large" severity="secondary" (click)="onChatToggle()" class="btn-inside-h-full"
                  [severity]="isChatVisible() ? 'contrast' : 'secondary'">
          <ng-template #content>
            <fa-icon [icon]="faMessage"/>
          </ng-template>
        </p-button>
      </div>

      <div class="flex gap-4 items-center justify-self-end">
        <p class="text-white justify-self-end">{{ roomName() }}</p>
        <p-button icon="pi pi-sign-out" severity="danger" (click)="onDisconnect()" size="large"/>
      </div>
    </section>
  `,
  styles: [],
})
export class MeetingRoomControlsComponent {
  isMicrophoneEnabled = input.required<boolean>();
  isVideoEnabled = input.required<boolean>();
  isParticipantsSidebarVisible = input.required<boolean>();
  isChatVisible = input.required<boolean>();
  devices = input.required<DevicesModel>();
  roomName = input.required<string>();

  audioToggle = output<void>();
  videoToggle = output<void>();
  participantsToggle = output<void>();
  chatToggle = output<void>();
  screenShareToggle = output<void>();
  recordingToggle = output<void>();
  disconnect = output<void>();
  audioInputChange = output<string>();
  videoInputChange = output<string>();
  audioOutputChange = output<string>();

  devicesMenuItems: Signal<DevicesMenuItemsModel> = computed(() => {
    return {
      audioInputs_Outputs: [
        ...this.devices().audioInputs.map(({label, deviceId}) => ({
          label,
          command: () => this.onAudioInputChange(deviceId),
          id: deviceId,
          icon: this.devices().activeAudioInput === deviceId ? 'pi pi-check' : undefined,
        })),
        {separator: true},
        ...this.devices().audioOutputs.map(({label, deviceId}) => ({
          label,
          command: () => this.onAudioOutputChange(deviceId),
          id: deviceId,
          icon: this.devices().activeAudioOutput === deviceId ? 'pi pi-check' : undefined,
        })),
      ],
      videoInputs: this.devices().videoInputs.map(({label, deviceId}) => ({
        label,
        command: () => this.onVideoInputChange(deviceId),
        id: deviceId,
        icon: this.devices().activeVideoInput === deviceId ? 'pi pi-check' : undefined,
      })),
    };
  });
  protected readonly faMessage = faMessage;

  onAudioToggle(): void {
    this.audioToggle.emit();
  }

  onVideoToggle(): void {
    this.videoToggle.emit();
  }

  onParticipantsToggle(): void {
    this.participantsToggle.emit();
  }

  onChatToggle(): void {
    this.chatToggle.emit();
  }

  onScreenShareToggle(): void {
    this.screenShareToggle.emit();
  }

  onRecordingToggle(): void {
    this.recordingToggle.emit();
  }

  onDisconnect(): void {
    this.disconnect.emit();
  }

  onAudioInputChange(deviceId: string): void {
    this.audioInputChange.emit(deviceId);
  }

  onVideoInputChange(deviceId: string): void {
    this.videoInputChange.emit(deviceId);
  }

  onAudioOutputChange(deviceId: string): void {
    this.audioOutputChange.emit(deviceId);
  }
}
