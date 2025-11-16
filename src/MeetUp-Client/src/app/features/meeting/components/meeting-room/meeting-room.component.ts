import {AfterViewInit, Component, ElementRef, input, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {
  ChatMessage,
  ConnectionState,
  isLocalParticipant,
  LocalParticipant,
  LocalTrackPublication,
  LocalVideoTrack,
  Participant,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  RemoteVideoTrack,
  Room,
  RoomEvent,
  Track
} from 'livekit-client';
import {ParticipantCardComponent} from "../participant-card/participant-card.component";
import {ParticipantsSidebarComponent} from "../participants-sidebar/participants-sidebar.component";
import {LayoutService} from '../../services/layout/layout.service';
import {LivekitService} from '../../services/livekit/livekit.service';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {DevicesModel} from '../../models/devices.model';
import {MeetingRoomControlsComponent} from "../meeting-room-controls/meeting-room-controls.component";
import {MeetingChatMessage, MeetingRoomChatComponent} from "../meeting-room-chat/meeting-room-chat.component";
import {ParticipantVideoComponent} from '../participant-video/participant-video.component';
import {AspectRatioModel} from '../../models/aspect-ratio.model';
import {DimensionModel} from '../../models/dimension.model';
import {Button} from 'primeng/button';
import {MeetingPagedList} from '../../utils/meeting-paged-list';

@Component({
  selector: 'app-meeting-room',
  imports: [ParticipantCardComponent, ParticipantsSidebarComponent, Toast, MeetingRoomControlsComponent, MeetingRoomChatComponent, ParticipantVideoComponent, Button],
  template: `
    <div class="h-screen flex flex-col p-4 bg-neutral-900 gap-4">
      <section class="flex flex-auto gap-4 overflow-hidden">
        <div class="flex flex-col lg:flex-row gap-4 overflow-hidden" #mainContainer>
          @if (isScreenShareEnabled()) {
            <div class="flex flex-4 justify-center items-center overflow-hidden">
              <app-participant-video [videoTrack]="screenShareTrack()"
                                     [isVideoEnabled]="true"
                                     [objectFit]="'contain'"
                                     [isLocal]="false" class="h-full lg:h-fit"/>
            </div>
          }
          <div
            class="flex gap-2 justify-center content-center items-center flex-wrap lg:h-full"
            [class.flex-grow]="!isScreenShareEnabled()"
            [class]="{'h-1/3': isScreenShareEnabled()}"
            [class.lg:flex-1]="isScreenShareEnabled()"
            #participantsContainer>
            @for (participant of participantsList.items(); track participant!.identity) {
              <app-participant-card
                [style.width.px]="participantsList.pagedItems().includes(participant) ? gridDimension().width : 0"
                [style.height.px]="participantsList.pagedItems().includes(participant) ? gridDimension().height : 0"
                [style.flex-shrink]="0"
                [participant]="participant!"
                [class.hidden]="!participantsList.pagedItems().includes(participant)"
                (speak)="onParticipantSpeaking($event)"
                class="animate-fadein"></app-participant-card>
            }
            @if (participantsList.hasNextPage()) {
              <p-button label="Show Others" (click)="participantsList.nextPage()" severity="secondary"/>
            }
            @if (participantsList.hasPreviousPage()) {
              <p-button label="Go Back" (click)="participantsList.previousPage()" severity="secondary"/>
            }
          </div>
        </div>
        @if (isParticipantsSidebarVisible()) {
          <app-participants-sidebar class="flex-shrink-0 w-1/4 animate-slidein"
                                    [participants]="participantsList.items()"
                                    (close)="toggleParticipantsSidebar()"/>
        }
        @if (isChatVisible()) {
          <app-meeting-chat class="flex-shrink-0 w-1/3 animate-slidein" [messages]="chatMessages()"
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
        (screenShareToggle)="toggleScreenShare()"
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
  @ViewChild('participantsContainer') participantsContainer!: ElementRef<HTMLElement>;
  @ViewChild('mainContainer') mainContainer!: ElementRef<HTMLElement>;
  gridDimension = signal<DimensionModel>({width: 0, height: 0});
  screenShareLayout = signal({width: 0, height: 0});
  isMicrophoneEnabled = signal(false);
  isVideoEnabled = signal(false);
  isParticipantsSidebarVisible = signal(false);
  isChatVisible = signal(false);
  chatMessages = signal<MeetingChatMessage[]>([]);
  isScreenShareEnabled = signal(false);
  screenShareTrack = signal<LocalVideoTrack | RemoteVideoTrack | null>(null);
  devices = signal<DevicesModel>({
    audioInputs: [],
    audioOutputs: [],
    videoInputs: [],
  });
  private readonly DEFAULT_PAGE_SIZE = 2;
  participantsList = new MeetingPagedList([], this.DEFAULT_PAGE_SIZE);
  private readonly PAGE_SIZE_WITH_SCREEN_SHARE = 2;
  private resizeObserver?: ResizeObserver;

  constructor(private layoutService: LayoutService, private livekitService: LivekitService, private messageService: MessageService) {
  }

  async ngOnInit() {
    this.participantsList = new MeetingPagedList([this.room().localParticipant, ...this.room().remoteParticipants.values()], this.DEFAULT_PAGE_SIZE);
    this.room()
      .on(RoomEvent.ParticipantConnected, this.handleParticipantConnected)
      .on(RoomEvent.ParticipantDisconnected, this.handleParticipantDisconnected)
      .on(RoomEvent.ActiveDeviceChanged, this.handleActiveDeviceChanged)
      .on(RoomEvent.ChatMessage, this.handleChatMessage)
      .on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed)
      .on(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed)
      .on(RoomEvent.LocalTrackPublished, this.handleLocalTrackPublished)
      .on(RoomEvent.LocalTrackUnpublished, this.handleLocalTrackUnpublished);
    this.isMicrophoneEnabled.set(this.room().localParticipant.isMicrophoneEnabled);
    this.isVideoEnabled.set(this.room().localParticipant.isCameraEnabled);
    await this.loadDevices();
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(entries => {
      if (!entries || !entries.length) {
        return;
      }

      for (const entry of entries) {
        this.recalculateLayout();
      }
    });

    this.resizeObserver.observe(this.participantsContainer.nativeElement);
    this.resizeObserver.observe(this.mainContainer.nativeElement);
    this.recalculateLayout();
  }

  async ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.room()
      .off(RoomEvent.ParticipantConnected, this.handleParticipantConnected)
      .off(RoomEvent.ParticipantDisconnected, this.handleParticipantDisconnected)
      .off(RoomEvent.ActiveDeviceChanged, this.handleActiveDeviceChanged)
      .off(RoomEvent.ChatMessage, this.handleChatMessage)
      .off(RoomEvent.TrackSubscribed, this.handleTrackSubscribed)
      .off(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed)
      .off(RoomEvent.LocalTrackPublished, this.handleLocalTrackPublished)
      .off(RoomEvent.LocalTrackUnpublished, this.handleLocalTrackUnpublished);
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

  async toggleScreenShare() {
    await this.room().localParticipant.setScreenShareEnabled(!this.room().localParticipant.isScreenShareEnabled);
    this.messageService.add({
      severity: 'info',
      summary: 'Screen Share',
      detail: this.room().localParticipant.isScreenShareEnabled ? 'Started sharing screen' : 'Stopped sharing screen',
    });
    this.isScreenShareEnabled.set(this.room().localParticipant.isScreenShareEnabled);
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

  onParticipantSpeaking(participant: Participant) {
    this.participantsList.bringToFront(participant);
  }

  private handleParticipantConnected = (participant: RemoteParticipant) => {
    this.participantsList.addItem(participant);
    this.messageService.add({
      severity: 'info',
      summary: 'Participant Joined',
      detail: `${participant.identity} joined the meeting`,
    });
    this.recalculateLayout();
  };

  private handleParticipantDisconnected = (participant: RemoteParticipant) => {
    this.participantsList.removeItem(p => p.identity === participant.identity);
    this.messageService.add({
      severity: 'info',
      summary: 'Participant Left',
      detail: `${participant.identity} left the meeting`,
    });
    this.recalculateLayout();
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

  private handleTrackSubscribed = (track: RemoteTrack, pub: RemoteTrackPublication, participant: RemoteParticipant) => {
    if (pub.source === Track.Source.ScreenShare) {
      this.isScreenShareEnabled.set(true);
      this.screenShareTrack.set(track as RemoteVideoTrack);
    }
  }

  private handleTrackUnsubscribed = (track: RemoteTrack, pub: RemoteTrackPublication, participant: RemoteParticipant) => {
    if (pub.source === Track.Source.ScreenShare) {
      this.isScreenShareEnabled.set(false);
      this.screenShareTrack.set(null);
    }
  }

  private handleLocalTrackPublished = (pub: LocalTrackPublication, participant: LocalParticipant) => {
    if (pub.source === Track.Source.ScreenShare) {
      this.isScreenShareEnabled.set(true);
      this.screenShareTrack.set(pub.track as LocalVideoTrack);
    }
  }
  private handleLocalTrackUnpublished = (pub: LocalTrackPublication, participant: LocalParticipant) => {
    if (pub.source === Track.Source.ScreenShare) {
      this.isScreenShareEnabled.set(false);
      this.screenShareTrack.set(null);
    }
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

  private recalculateLayout() {
    const participantsContainer = this.participantsContainer.nativeElement.getBoundingClientRect();
    const margin = 16;
    this.updateGridDimension({
      width: participantsContainer.width - margin,
      height: participantsContainer.height - margin
    });
  }

  private updateGridDimension(dimension: DimensionModel): void {
    this.gridDimension.set(this.layoutService.calculateGridDimension({
      dimension,
      totalGrids: this.participantsList.pagedItems().length,
      aspectRatio: AspectRatioModel.FourThree,
    }));
  }
}
