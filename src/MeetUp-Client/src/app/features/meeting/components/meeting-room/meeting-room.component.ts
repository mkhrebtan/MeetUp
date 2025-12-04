import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  ChatMessage,
  ConnectionState,
  isLocalParticipant,
  LocalTrackPublication,
  LocalVideoTrack,
  Participant,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  RemoteVideoTrack,
  Room,
  RoomEvent,
  Track,
} from 'livekit-client';
import { ParticipantCardComponent } from '../participant-card/participant-card.component';
import { ParticipantsSidebarComponent } from '../participants-sidebar/participants-sidebar.component';
import { LayoutService } from '../../services/layout.service';
import { LivekitService } from '../../services/livekit.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { DevicesModel } from '../../models/devices.model';
import { MeetingRoomControlsComponent } from '../meeting-room-controls/meeting-room-controls.component';
import {
  MeetingChatMessage,
  MeetingRoomChatComponent,
} from '../meeting-room-chat/meeting-room-chat.component';
import { ParticipantVideoComponent } from '../participant-video/participant-video.component';
import { AspectRatioModel } from '../../models/aspect-ratio.model';
import { DimensionModel } from '../../models/dimension.model';
import { Button } from 'primeng/button';
import { MeetingPagedList } from '../../utils/meeting-paged-list';
import { Meeting } from '../../models/meeting.model';
import { RoomMetadata } from '../../models/room-metadata.model';

@Component({
  selector: 'app-meeting-room',
  imports: [
    ParticipantCardComponent,
    ParticipantsSidebarComponent,
    Toast,
    MeetingRoomControlsComponent,
    MeetingRoomChatComponent,
    ParticipantVideoComponent,
    Button,
  ],
  template: `
    <div class="h-screen flex flex-col p-4 bg-neutral-900 gap-4">
      <section class="flex flex-auto gap-4 overflow-hidden">
        <div class="flex flex-col lg:flex-row gap-4 overflow-hidden w-full relative" #mainContainer>
          @if (isScreenShareEnabled()) {
            <div class="flex flex-3 xl:flex-3 justify-center items-center overflow-hidden">
              <app-participant-video
                [videoTrack]="screenShareTrack()"
                [isVideoEnabled]="true"
                [objectFit]="'contain'"
                [isLocal]="false"
                class="h-full lg:h-fit"
              />
            </div>
          }
          <div
            class="flex gap-2 justify-center content-center items-center flex-wrap lg:h-full"
            [class.flex-grow]="!isScreenShareEnabled()"
            [class]="{ 'h-1/3': isScreenShareEnabled() }"
            [class.lg:flex-1]="isScreenShareEnabled()"
            #participantsContainer
          >
            @for (participant of participantsList.items(); track participant!.identity) {
              <app-participant-card
                [style.width.px]="
                  participantsList.pagedItems().includes(participant) ? gridDimension().width : 0
                "
                [style.height.px]="
                  participantsList.pagedItems().includes(participant) ? gridDimension().height : 0
                "
                [style.flex-shrink]="0"
                [participant]="participant!"
                [class.hidden]="!participantsList.pagedItems().includes(participant)"
                (speak)="onParticipantSpeaking($event)"
                class="animate-fadein"
              ></app-participant-card>
            }
            @if (participantsList.hasNextPage()) {
              <p-button
                label="Show Others"
                (click)="participantsList.nextPage()"
                severity="secondary"
                size="small"
                class="absolute bottom-0 right-5 z-10"
              />
            }
            @if (participantsList.hasPreviousPage()) {
              <p-button
                label="Go Back"
                (click)="participantsList.previousPage()"
                severity="secondary"
                size="small"
                class="absolute bottom-0 left-5 z-10"
              />
            }
          </div>
        </div>
        @if (isParticipantsSidebarVisible()) {
          <app-participants-sidebar
            class="shrink-0 w-1/4 xl:w-1/5 animate-slidein"
            [participants]="participantsList.items()"
            (closed)="toggleParticipantsSidebar()"
          />
        }
        @if (isChatVisible()) {
          <app-meeting-chat
            class="shrink-0 w-1/4 xl:w-1/5 animate-slidein"
            [messages]="chatMessages()"
            (closed)="toggleChat()"
            (messageSend)="sendChatMessage($event)"
          />
        }
      </section>

      <div class="h-px bg-neutral-800"></div>

      <app-meeting-room-controls
        [isHost]="meeting().isHost"
        [isMicrophoneEnabled]="isMicrophoneEnabled()"
        [isVideoEnabled]="isVideoEnabled()"
        [isParticipantsSidebarVisible]="isParticipantsSidebarVisible()"
        [isChatAllowed]="roomMetadata().ChatEnabled"
        [isScreenShareAllowed]="roomMetadata().ScreenShareEnabled"
        [isChatVisible]="isChatVisible()"
        [isRecording]="isRecording()"
        [screenShareState]="screenShareState()"
        [devices]="devices()"
        [roomName]="roomMetadata().RoomName"
        (audioToggle)="toggleAudio()"
        (videoToggle)="toggleVideo()"
        (chatToggle)="toggleChat()"
        (participantsToggle)="toggleParticipantsSidebar()"
        (screenShareToggle)="toggleScreenShare()"
        (disconnect)="disconnectFromRoom()"
        (audioInputChange)="changeAudioInput($event)"
        (audioOutputChange)="changeAudioOutput($event)"
        (videoInputChange)="changeVideoInput($event)"
        (chatPermissionToggle)="toggleChatPermission()"
        (screenSharePermissionToggle)="toggleScreenSharePermission()"
        (recordingToggle)="toggleRecording()"
        (endMeeting)="onEndMeeting()"
      />

      <p-toast />
    </div>
  `,
  styles: [],
  providers: [MessageService],
})
export class MeetingRoomComponent implements OnInit, AfterViewInit, OnDestroy {
  room = input.required<Room>();
  meeting = input.required<Meeting>();
  roomMetadata = signal<RoomMetadata>({
    RoomName: '',
    ChatEnabled: false,
    ScreenShareEnabled: false,
  });
  @ViewChild('participantsContainer') participantsContainer!: ElementRef<HTMLElement>;
  @ViewChild('mainContainer') mainContainer!: ElementRef<HTMLElement>;
  gridDimension = signal<DimensionModel>({ width: 0, height: 0 });
  screenShareLayout = signal({ width: 0, height: 0 });
  isMicrophoneEnabled = signal(false);
  isVideoEnabled = signal(false);
  isParticipantsSidebarVisible = signal(false);
  isChatVisible = signal(false);
  chatMessages = signal<MeetingChatMessage[]>([]);
  isScreenShareEnabled = signal(false);
  isRecording = signal(false);
  recordingId = signal<string | null>(null);
  screenShareTrack = signal<LocalVideoTrack | RemoteVideoTrack | null>(null);
  screenShareState = computed(() => {
    if (this.isScreenShareEnabled()) {
      if (this.screenShareTrack() instanceof RemoteVideoTrack) {
        return 'remote';
      } else {
        return 'local';
      }
    }
    return 'none';
  });
  devices = signal<DevicesModel>({
    audioInputs: [],
    audioOutputs: [],
    videoInputs: [],
  });
  private readonly DEFAULT_PAGE_SIZE = 2;
  participantsList = new MeetingPagedList([], this.DEFAULT_PAGE_SIZE);
  private readonly PAGE_SIZE_WITH_SCREEN_SHARE = 2;
  private resizeObserver?: ResizeObserver;

  layoutService = inject(LayoutService);
  livekitService = inject(LivekitService);
  messageService = inject(MessageService);

  async ngOnInit() {
    console.log(this.room().metadata);
    this.roomMetadata.set(JSON.parse(this.room().metadata ?? '{}'));
    console.log(this.roomMetadata());
    this.participantsList = new MeetingPagedList(
      [this.room().localParticipant, ...this.room().remoteParticipants.values()],
      this.DEFAULT_PAGE_SIZE,
    );
    this.room()
      .on(RoomEvent.ParticipantConnected, this.handleParticipantConnected)
      .on(RoomEvent.ParticipantDisconnected, this.handleParticipantDisconnected)
      .on(RoomEvent.ActiveDeviceChanged, this.handleActiveDeviceChanged)
      .on(RoomEvent.ChatMessage, this.handleChatMessage)
      .on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed)
      .on(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed)
      .on(RoomEvent.LocalTrackPublished, this.handleLocalTrackPublished)
      .on(RoomEvent.LocalTrackUnpublished, this.handleLocalTrackUnpublished)
      .on(RoomEvent.RoomMetadataChanged, this.handleMetadataChanged);
    this.isMicrophoneEnabled.set(this.room().localParticipant.isMicrophoneEnabled);
    this.isVideoEnabled.set(this.room().localParticipant.isCameraEnabled);
    await this.loadDevices();
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.recalculateLayout();
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
      .off(RoomEvent.LocalTrackUnpublished, this.handleLocalTrackUnpublished)
      .off(RoomEvent.RoomMetadataChanged, this.handleMetadataChanged);
    if (this.room().state !== ConnectionState.Disconnected) {
      await this.room()?.disconnect();
    }
  }

  async toggleVideo() {
    await this.room().localParticipant.setCameraEnabled(
      !this.room().localParticipant.isCameraEnabled,
    );
    this.isVideoEnabled.set(this.room().localParticipant.isCameraEnabled);
  }

  async toggleAudio() {
    await this.room().localParticipant.setMicrophoneEnabled(
      !this.room().localParticipant.isMicrophoneEnabled,
    );
    this.isMicrophoneEnabled.set(this.room().localParticipant.isMicrophoneEnabled);
  }

  async disconnectFromRoom() {
    await this.room().disconnect();
  }

  toggleParticipantsSidebar() {
    this.isChatVisible.set(false);
    this.isParticipantsSidebarVisible.update((prev) => !prev);
  }

  toggleChat() {
    this.isParticipantsSidebarVisible.set(false);
    this.isChatVisible.update((prev) => !prev);
  }

  async toggleScreenShare() {
    await this.room().localParticipant.setScreenShareEnabled(
      !this.room().localParticipant.isScreenShareEnabled,
    );
    this.messageService.add({
      severity: 'info',
      summary: 'Screen Share',
      detail: this.room().localParticipant.isScreenShareEnabled
        ? 'Started sharing screen'
        : 'Stopped sharing screen',
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

  toggleChatPermission() {
    this.livekitService
      .updateRoomMetadata(this.room().name, {
        RoomName: this.roomMetadata().RoomName,
        ChatEnabled: !this.roomMetadata().ChatEnabled,
        ScreenShareEnabled: this.roomMetadata().ScreenShareEnabled,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Chat Permission',
            detail: 'Chat permission updated successfully',
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.detail || 'Failed to update chat permission',
          });
        },
      });
  }

  toggleScreenSharePermission() {
    this.livekitService
      .updateRoomMetadata(this.room().name, {
        RoomName: this.roomMetadata().RoomName,
        ChatEnabled: this.roomMetadata().ChatEnabled,
        ScreenShareEnabled: !this.roomMetadata().ScreenShareEnabled,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Screen Share Permission',
            detail: 'Screen share permission updated successfully',
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.detail || 'Failed to update screen share permission',
          });
        },
      });
  }

  toggleRecording() {
    if (this.isRecording()) {
      const recordingId = this.recordingId();
      if (!recordingId) return;

      this.livekitService.stopRecording(this.room().name, recordingId).subscribe({
        next: () => {
          this.isRecording.set(false);
          this.recordingId.set(null);
          this.messageService.add({
            severity: 'info',
            summary: 'Recording',
            detail: 'Recording stopped',
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.detail || 'Failed to stop recording',
          });
        },
      });
    } else {
      this.livekitService.startRecording(this.room().name).subscribe({
        next: (response) => {
          this.isRecording.set(true);
          this.recordingId.set(response.recordingId);
          this.messageService.add({
            severity: 'info',
            summary: 'Recording',
            detail: 'Recording started',
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.detail || 'Failed to start recording',
          });
        },
      });
    }
  }

  onEndMeeting() {
    this.livekitService.deleteRoom(this.meeting().id).subscribe({
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.detail || 'Failed to end meeting',
        });
      },
    });
  }

  onParticipantSpeaking(participant: Participant) {
    this.participantsList.bringToFront(participant);
  }

  private handleParticipantConnected = (participant: RemoteParticipant) => {
    this.participantsList.addItem(participant);
    this.messageService.add({
      severity: 'info',
      summary: 'Participant Joined',
      detail: `${participant.name} joined the meeting`,
    });
    this.recalculateLayout();
  };

  private handleParticipantDisconnected = (participant: RemoteParticipant) => {
    this.participantsList.removeItem((p) => p.identity === participant.identity);
    this.messageService.add({
      severity: 'info',
      summary: 'Participant Left',
      detail: `${participant.name} left the meeting`,
    });
    this.recalculateLayout();
  };

  private handleActiveDeviceChanged = async () => {
    await this.loadDevices();
  };

  private handleChatMessage = (msg: ChatMessage, participant?: Participant) => {
    const isLocal = isLocalParticipant(participant!);
    this.chatMessages.update((prev) => [
      ...prev,
      {
        message: msg.message,
        sender: isLocal ? 'You' : (participant?.name ?? 'Unknown'),
        timestamp: new Date(msg.timestamp),
        isLocalParticipant: isLocal,
      },
    ]);
  };

  private handleTrackSubscribed = (track: RemoteTrack, pub: RemoteTrackPublication) => {
    if (pub.source === Track.Source.ScreenShare) {
      this.isScreenShareEnabled.set(true);
      this.screenShareTrack.set(track as RemoteVideoTrack);
    }
  };

  private handleTrackUnsubscribed = (track: RemoteTrack, pub: RemoteTrackPublication) => {
    if (pub.source === Track.Source.ScreenShare) {
      this.isScreenShareEnabled.set(false);
      this.screenShareTrack.set(null);
    }
  };

  private handleLocalTrackPublished = (pub: LocalTrackPublication) => {
    if (pub.source === Track.Source.ScreenShare) {
      this.isScreenShareEnabled.set(true);
      this.screenShareTrack.set(pub.track as LocalVideoTrack);
    }
  };

  private handleLocalTrackUnpublished = (pub: LocalTrackPublication) => {
    if (pub.source === Track.Source.ScreenShare) {
      this.isScreenShareEnabled.set(false);
      this.screenShareTrack.set(null);
    }
  };

  private handleMetadataChanged = (metadata: string) => {
    this.roomMetadata.set(JSON.parse(metadata || '{}') as RoomMetadata);
    if (
      !this.roomMetadata().ScreenShareEnabled &&
      this.isScreenShareEnabled() &&
      this.screenShareState() === 'local' &&
      !this.meeting().isHost
    ) {
      this.toggleScreenShare();
    }

    if (!this.roomMetadata().ChatEnabled && this.isChatVisible() && !this.meeting().isHost) {
      this.toggleChat();
    }
  };

  private async loadDevices() {
    await this.livekitService.loadDevices().then((devices) => {
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
      height: participantsContainer.height - margin,
    });
  }

  private updateGridDimension(dimension: DimensionModel): void {
    this.gridDimension.set(
      this.layoutService.calculateGridDimension({
        dimension,
        totalGrids: this.participantsList.pagedItems().length,
        aspectRatio: AspectRatioModel.FourThree,
      }),
    );
  }
}
