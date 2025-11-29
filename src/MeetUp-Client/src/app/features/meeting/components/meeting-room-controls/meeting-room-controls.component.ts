import { Component, computed, inject, input, output, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { SplitButton } from 'primeng/splitbutton';
import { DevicesModel } from '../../models/devices.model';
import { DevicesMenuItemsModel } from '../../models/devices-menu-items.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { Tooltip } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { TieredMenu } from 'primeng/tieredmenu';

@Component({
  selector: 'app-meeting-room-controls',
  standalone: true,
  imports: [CommonModule, Button, SplitButton, FaIconComponent, Tooltip, TieredMenu],
  template: `
    <section class="grid grid-cols-3 items-center gap-2 px-4">
      <div class="flex gap-2 w-fit h-full">
        <p-split-button
          dropdownIcon="pi pi-chevron-up before:text-xs"
          (onClick)="onAudioToggle()"
          [severity]="isMicrophoneEnabled() ? 'secondary' : 'danger'"
          [model]="devicesMenuItems().audioInputs_Outputs"
          size="small"
        >
          <ng-template #content>
            <i class="pi pi-microphone px-1 before:text-lg"></i>
          </ng-template>
        </p-split-button>
        <p-split-button
          dropdownIcon="pi pi-chevron-up before:text-xs"
          (onClick)="onVideoToggle()"
          [severity]="isVideoEnabled() ? 'secondary' : 'danger'"
          [model]="devicesMenuItems().videoInputs"
        >
          <ng-template #content>
            <i class="pi pi-video px-1 before:text-lg"></i>
          </ng-template>
        </p-split-button>
      </div>

      <div class="flex justify-center gap-2">
        <p-button
          icon="pi pi-users"
          size="large"
          [severity]="isParticipantsSidebarVisible() ? 'contrast' : 'secondary'"
          (click)="onParticipantsToggle()"
          pTooltip="Show participants"
          tooltipPosition="top"
        />
        <p-button
          size="large"
          severity="secondary"
          [severity]="isChatVisible() ? 'contrast' : 'secondary'"
          (click)="onChatToggle()"
          class="btn-inside-h-full"
          [pTooltip]="isChatAllowed() ? 'Chat' : 'Chat is disabled'"
          tooltipPosition="top"
          [disabled]="!isHost() && !isChatAllowed()"
        >
          <ng-template #content>
            <fa-icon [icon]="faMessage" />
          </ng-template>
        </p-button>
        <p-button
          icon="pi pi-desktop"
          size="large"
          [severity]="screenShareState() === 'local' ? 'contrast' : 'secondary'"
          [disabled]="screenShareState() === 'remote' || (!isHost() && !isScreenShareAllowed())"
          [pTooltip]="screenShareTooltip()"
          tooltipPosition="top"
          (click)="onScreenShareToggle()"
        />
        @if (isHost()) {
          <p-button
            icon="pi pi-stop-circle"
            size="large"
            severity="secondary"
            pTooltip="Start/Stop recording"
            tooltipPosition="top"
            (click)="onRecordingToggle()"
          />
        }
        @if (isHost()) {
          <p-button
            icon="pi pi-ellipsis-v"
            size="large"
            (click)="menu.toggle($event)"
            severity="secondary"
            pTooltip="More options"
            tooltipPosition="top"
          />
          <p-tiered-menu #menu [model]="roomTieredMenuItems()" [popup]="true" />
        }
      </div>

      <div class="flex gap-4 items-center justify-self-end">
        <p class="text-white justify-self-end">{{ roomName() }}</p>
        @if (isHost()) {
          <p-button
            icon="pi pi-sign-out"
            severity="danger"
            (click)="menuLeave.toggle($event)"
            size="large"
          />
          <p-tiered-menu #menuLeave [model]="leaveTieredMenuItems()" [popup]="true" />
        } @else {
          <p-button icon="pi pi-sign-out" severity="danger" (click)="onDisconnect()" size="large" />
        }
      </div>
    </section>
  `,
  styles: [],
})
export class MeetingRoomControlsComponent {
  isHost = input.required<boolean>();
  isChatAllowed = input.required<boolean>();
  isScreenShareAllowed = input.required<boolean>();
  isMicrophoneEnabled = input.required<boolean>();
  isVideoEnabled = input.required<boolean>();
  isParticipantsSidebarVisible = input.required<boolean>();
  isChatVisible = input.required<boolean>();
  screenShareState = input.required<'local' | 'remote' | 'none'>();
  devices = input.required<DevicesModel>();
  roomName = input.required<string>();

  chatPermissionToggle = output<void>();
  screenSharePermissionToggle = output<void>();
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
  endMeeting = output<void>();

  devicesMenuItems: Signal<DevicesMenuItemsModel> = computed(() => {
    return {
      audioInputs_Outputs: [
        ...this.devices().audioInputs.map(({ label, deviceId }) => ({
          label,
          command: () => this.onAudioInputChange(deviceId),
          id: deviceId,
          icon: this.devices().activeAudioInput === deviceId ? 'pi pi-check' : undefined,
        })),
        { separator: true },
        ...this.devices().audioOutputs.map(({ label, deviceId }) => ({
          label,
          command: () => this.onAudioOutputChange(deviceId),
          id: deviceId,
          icon: this.devices().activeAudioOutput === deviceId ? 'pi pi-check' : undefined,
        })),
      ],
      videoInputs: this.devices().videoInputs.map(({ label, deviceId }) => ({
        label,
        command: () => this.onVideoInputChange(deviceId),
        id: deviceId,
        icon: this.devices().activeVideoInput === deviceId ? 'pi pi-check' : undefined,
      })),
    };
  });
  screenShareTooltip = computed(() => {
    if (!this.isHost() && !this.isScreenShareAllowed()) {
      return 'Screen sharing is disabled';
    } else if (this.screenShareState() === 'remote') {
      return 'Someone else is sharing the screen';
    } else if (this.screenShareState() === 'local') {
      return 'Stop sharing';
    } else {
      return 'Start sharing';
    }
  });
  roomTieredMenuItems = computed(() => {
    return [
      {
        label: 'Chat',
        command: () => this.toggleChatPermission(),
        icon: this.isChatAllowed() ? 'pi pi-check' : 'pi pi-times',
        tooltip: this.isChatAllowed()
          ? 'Enable chat for participants'
          : 'Disable chat for participants',
        tooltipPosition: 'top',
      },
      {
        label: 'Screen Share',
        command: () => this.toggleScreenSharePermission(),
        icon: this.isScreenShareAllowed() ? 'pi pi-check' : 'pi pi-times',
        tooltip: this.isScreenShareAllowed()
          ? 'Enable screen share for participants'
          : 'Disable screen share for participants',
        tooltipPosition: 'top',
      },
    ];
  });
  leaveTieredMenuItems = computed(() => {
    return [
      {
        label: 'End meeting',
        command: () => this.onEndMeeting(),
        icon: 'pi pi-times',
        tooltip: 'End the meeting',
        tooltipPosition: 'top',
      },
      {
        label: 'Leave',
        command: () => this.onDisconnect(),
        icon: 'pi pi-sign-out',
        tooltip: 'Leave the meeting',
        tooltipPosition: 'top',
      },
    ];
  });
  protected readonly faMessage = faMessage;

  messageService = inject(MessageService);

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

  onEndMeeting(): void {
    this.endMeeting.emit();
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

  toggleChatPermission(): void {
    this.chatPermissionToggle.emit();
  }

  toggleScreenSharePermission(): void {
    this.screenSharePermissionToggle.emit();
  }

  log() {
    console.log({
      isChatAllowed: this.isChatAllowed(),
      isScreenShareAllowed: this.isScreenShareAllowed(),
    });
  }
}
