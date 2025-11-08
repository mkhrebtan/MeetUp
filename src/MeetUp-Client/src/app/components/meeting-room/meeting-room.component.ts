import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import {ConnectionState, RemoteParticipant, Room, RoomEvent} from 'livekit-client';
import {ParticipantCardComponent} from "../participant-card/participant-card.component";
import {ParticipantsSidebarComponent} from "../participants-sidebar/participants-sidebar.component";
import {LayoutService} from '../../services/layout/layout.service';
import {VideoLayoutModel} from '../../models/video-layout.model';
import {LivekitService} from '../../services/livekit/livekit.service';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-meeting-room',
  imports: [ParticipantCardComponent, Button, ParticipantsSidebarComponent, SplitButton, Toast],
  template: `
    <div class="h-screen flex flex-col p-4 bg-neutral-900 gap-4">
      <section class="flex flex-auto gap-4 overflow-hidden">
        <div
          class="flex-auto flex flex-wrap content-center justify-center gap-2 overflow-hidden"
          #participantsContainer>
          @for (participant of allParticipants(); track participant!.identity) {
            <app-participant-card [style.width.px]="calculatedLayout().cardWidth"
                                  [style.height.px]="calculatedLayout().cardHeight"
                                  [style.flex-shrink]="0"
                                  [participant]="participant!" class="animate-fadein"></app-participant-card>
          }
        </div>
        @if (isParticipantsSidebarVisible()) {
          <app-participants-sidebar class="flex-shrink-0 w-70 animate-slidein" [participants]="allParticipants()"
                                    (close)="toggleParticipantsSidebar()"/>
        }
      </section>
      <div class="h-[1px] bg-neutral-800"></div>

      <app-meeting-room-controls
        [isMicrophoneEnabled]="isMicrophoneEnabled()"
        [isVideoEnabled]="isVideoEnabled()"
        [isParticipantsSidebarVisible]="isParticipantsSidebarVisible()"
        [isChatVisible]="isChatVisible()"
        [devices]="devices()"
        [roomName]="room().name"
        (audioToggle)="toggleAudio()"
        (videoToggle)="toggleVideo()"
        (chatToggle)="toggleChat()"
        (participantsToggle)="toggleParticipantsSidebar()"
        (disconnect)="disconnectFromRoom()"
        (audioInputChange)="changeAudioInput($event)"
        (audioOutputChange)="changeAudioOutput($event)"
        (videoInputChange)="changeVideoInput($event)"
      />

      <p-toast/>
    </div>
  `,
  styles: [],
  providers: [MessageService],
})
export class MeetingRoomComponent implements OnInit, AfterViewInit, OnDestroy {
  room = input.required<Room>();
  remoteParticipants = signal<RemoteParticipant[]>([]);
  allParticipants = computed(() => [this.room().localParticipant, ...this.remoteParticipants()]);
  @ViewChild('participantsContainer') participantsContainer!: ElementRef<HTMLElement>;
  calculatedLayout = signal<VideoLayoutModel>({
    cardWidth: 0,
    cardHeight: 0,
  });
  isMicrophoneEnabled = signal(false);
  isVideoEnabled = signal(false);
  isParticipantsSidebarVisible = signal(false);
  devices: DevicesMenuItemsModel = {
    audioInputs_Outputs: [],
  devices = signal<DevicesModel>({
    audioInputs: [],
    audioOutputs: [],
    videoInputs: [],
  };
  private resizeObserver?: ResizeObserver;

  constructor(private layoutService: LayoutService, private livekitService: LivekitService, private messageService: MessageService) {
  }

  async ngOnInit() {
    this.remoteParticipants.set([...this.room().remoteParticipants.values()]);
    this.room()
      .on(RoomEvent.ParticipantConnected, this.handleParticipantConnected)
      .on(RoomEvent.ParticipantDisconnected, this.handleParticipantDisconnected)
      .on(RoomEvent.ActiveDeviceChanged, this.handleActiveDeviceChanged);
    this.isMicrophoneEnabled.set(this.room().localParticipant.isMicrophoneEnabled);
    this.isVideoEnabled.set(this.room().localParticipant.isCameraEnabled);
    await this.loadDevices();
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(entries => {
      if (!entries || !entries.length) {
        return;
      }

      this.recalculateLayout();
    });

    this.resizeObserver.observe(this.participantsContainer.nativeElement);
    this.recalculateLayout();
  }

  async ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.room()
      .off(RoomEvent.ParticipantConnected, this.handleParticipantConnected)
      .off(RoomEvent.ParticipantDisconnected, this.handleParticipantDisconnected)
      .off(RoomEvent.ActiveDeviceChanged, this.handleActiveDeviceChanged);
    if (this.room().state !== ConnectionState.Disconnected) {
      await this.room()?.disconnect();
    }
  }

  async toggleVideo() {
    await this.room().localParticipant.setCameraEnabled(!this.room().localParticipant.isCameraEnabled);
    this.isVideoEnabled.set(this.room().localParticipant.isCameraEnabled);
  }

  async toggleAudio() {
    await this.room().localParticipant.setMicrophoneEnabled(!this.room().localParticipant.isMicrophoneEnabled);
    this.isMicrophoneEnabled.set(this.room().localParticipant.isMicrophoneEnabled);
  }

  async disconnectFromRoom() {
    await this.room().disconnect();
  }

  toggleParticipantsSidebar() {
    this.isParticipantsSidebarVisible.update(prev => !prev);
  }

  recalculateLayout() {
    const container = this.participantsContainer.nativeElement.getBoundingClientRect();
    const width = container.width;
    const height = container.height - 8;

    if (!width || !height || !this.allParticipants().length) return;

    const gap = 8;
    const layout = this.layoutService.calculateOptimalMeetingGridLayout(width, height, this.allParticipants().length, 4 / 3, gap);

    this.calculatedLayout.set(layout);
  }

  async changeAudioInput(deviceId: string) {
    await this.room().switchActiveDevice('audioinput', deviceId);
  }

  async changeVideoInput(deviceId: string) {
    await this.room().switchActiveDevice('videoinput', deviceId);
  }

  async changeAudioOutput(deviceId: string) {
    await this.room().switchActiveDevice('audiooutput', deviceId);
  }

  private handleParticipantConnected = (participant: RemoteParticipant) => {
    this.remoteParticipants.update(prev => [...prev, participant]);
    this.messageService.add({
      severity: 'info',
      summary: 'Participant Joined',
      detail: `${participant.identity} joined the meeting`,
    });
  };

  private handleParticipantDisconnected = (participant: RemoteParticipant) => {
    this.remoteParticipants.update(prev => prev.filter(p => p.identity !== participant.identity));
    this.messageService.add({
      severity: 'info',
      summary: 'Participant Left',
      detail: `${participant.identity} left the meeting`,
    });
  };

  private handleActiveDeviceChanged = async () => {
    await this.loadDevices();
  }

  private async loadDevices() {
    await this.livekitService.loadDevices().then(devices => {
      this.devices.set({
        activeAudioInput: this.room().getActiveDevice('audioinput'),
        activeVideoInput: this.room().getActiveDevice('videoinput'),
        activeAudioOutput: this.room().getActiveDevice('audiooutput'),
        audioInputs: devices.audioInputs,
        audioOutputs: devices.audioOutputs,
        videoInputs: devices.videoInputs,
      });
    });
  }
}

interface DevicesMenuItemsModel {
  audioInputs_Outputs: MenuItem[],
  videoInputs: MenuItem[],
}
