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
import {
  ChatMessage,
  ConnectionState,
  isLocalParticipant,
  Participant,
  RemoteParticipant,
  Room,
  RoomEvent
} from 'livekit-client';
import {ParticipantCardComponent} from "../participant-card/participant-card.component";
import {ParticipantsSidebarComponent} from "../participants-sidebar/participants-sidebar.component";
import {LayoutService} from '../../services/layout/layout.service';
import {VideoLayoutModel} from '../../models/video-layout.model';
import {LivekitService} from '../../services/livekit/livekit.service';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {DevicesModel} from '../../models/devices.model';
import {MeetingRoomControlsComponent} from "../meeting-room-controls/meeting-room-controls.component";
import {MeetingChatComponent, MeetingChatMessage} from "../meeting-chat/meeting-chat.component";

@Component({
  selector: 'app-meeting-room',
  imports: [ParticipantCardComponent, ParticipantsSidebarComponent, Toast, MeetingRoomControlsComponent, MeetingChatComponent],
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
          <app-participants-sidebar class="flex-shrink-0 w-80 animate-slidein" [participants]="allParticipants()"
                                    (close)="toggleParticipantsSidebar()"/>
        }
        @if (isChatVisible()) {
          <app-meeting-chat class="flex-shrink-0 w-90 animate-slidein" [messages]="chatMessages()"
                            (close)="toggleChat()" (messageSend)="sendChatMessage($event)"/>
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
  isChatVisible = signal(false);
  devices = signal<DevicesModel>({
    audioInputs: [],
    audioOutputs: [],
    videoInputs: [],
  });
  chatMessages = signal<MeetingChatMessage[]>([]);
  private resizeObserver?: ResizeObserver;

  constructor(private layoutService: LayoutService, private livekitService: LivekitService, private messageService: MessageService) {
  }

  async ngOnInit() {
    this.remoteParticipants.set([...this.room().remoteParticipants.values()]);
    this.room()
      .on(RoomEvent.ParticipantConnected, this.handleParticipantConnected)
      .on(RoomEvent.ParticipantDisconnected, this.handleParticipantDisconnected)
      .on(RoomEvent.ActiveDeviceChanged, this.handleActiveDeviceChanged)
      .on(RoomEvent.ChatMessage, this.handleChatMessage);
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
      .off(RoomEvent.ActiveDeviceChanged, this.handleActiveDeviceChanged)
      .off(RoomEvent.ChatMessage, this.handleChatMessage);
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
    this.isChatVisible.set(false);
    this.isParticipantsSidebarVisible.update(prev => !prev);
  }

  toggleChat() {
    this.isParticipantsSidebarVisible.set(false);
    this.isChatVisible.update(prev => !prev);
  }

  recalculateLayout() {
    const container = this.participantsContainer.nativeElement.getBoundingClientRect();
    const width = container.width;
    const height = container.height - 16;

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

  async sendChatMessage(message: string) {
    const localParticipant = this.room().localParticipant;
    await localParticipant.sendChatMessage(message);
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

  private handleChatMessage = (msg: ChatMessage, participant?: Participant) => {
    const isLocal = isLocalParticipant(participant!);
    this.chatMessages.update(prev => [...prev, {
      message: msg.message,
      sender: isLocal ? 'You' : participant?.identity ?? 'Unknown',
      timestamp: new Date(msg.timestamp),
      isLocalParticipant: isLocal,
    }]);
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
