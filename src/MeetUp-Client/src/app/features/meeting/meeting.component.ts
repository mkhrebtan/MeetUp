import {Component, inject, OnDestroy, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ConnectionState, DisconnectReason, Room, RoomEvent} from 'livekit-client';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetingService} from '../../core/services/meetings/meeting.service';
import {LivekitService} from './services/livekit/livekit.service';
import {MeetingModel} from '../../models/meeting.model';
import {RoomStageDataModel} from './models/room-stage-data.model';
import {MeetingRoomComponent} from './components/meeting-room/meeting-room.component';
import {MeetingStageComponent} from './components/meeting-stage/meeting-stage.component';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-meeting',
  imports: [FormsModule, InputTextModule, MeetingRoomComponent, MeetingStageComponent, Button],
  template: `
    <div>
      @if (isRoomConnected()) {
        <app-meeting-room [room]="room"/>
      } @else if (!isRoomConnected() && disconnectedReason()) {
        <div class="flex flex-col items-center justify-center h-screen gap-16">
          <h2 class="text-center text-4xl">{{ disconnectedReason() }}</h2>
          <div class="flex justify-center gap-4">
            <p-button label="Rejoin" severity="secondary" (click)="disconnectedReason.set(undefined)" [raised]="true"/>
            <p-button label="Return to meetings" severity="danger"
                      (click)="redirectBack()" [raised]="true"/>
          </div>
        </div>
      } @else {
        <app-meeting-stage (joinRoom)="connectToRoom($event)"/>
      }
    </div>
  `,
  styles: [],
})
export class MeetingComponent implements OnDestroy {
  room: Room;
  meetingId = '';
  meeting: MeetingModel;
  isRoomConnected = signal(false);
  disconnectedReason = signal<string | undefined>(undefined);
  private meetingService = inject(MeetingService);
  private livekitService = inject(LivekitService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.room = new Room({
      adaptiveStream: true,
      dynacast: true,
      publishDefaults: {
        videoCodec: 'av1',
      },
    });
    this.room
      .on(RoomEvent.Disconnected, this.handleRoomDisconnected);

    this.meetingId = this.route.snapshot.paramMap.get('meetingId') ?? '';
    const meeting = this.meetingService.getMeetingById(this.meetingId);
    if (!meeting) {
      throw new Error('MeetingModel not found');
    }

    this.meeting = meeting;
  }

  async ngOnDestroy() {
    this.room
      .off(RoomEvent.Disconnected, this.handleRoomDisconnected);
    if (this.room.state !== ConnectionState.Disconnected) {
      await this.room.disconnect();
    }
  }

  connectToRoom(stageData: RoomStageDataModel) {
    this.livekitService.getRoomToken(`user-${Math.floor(Math.random() * 100)}`, this.meeting.name)
      .subscribe({
        next: async (response) => {
          const token = response.token;
          try {
            await this.room.switchActiveDevice('audioinput', stageData.audioInputId);
            await this.room.switchActiveDevice('videoinput', stageData.videoInputId);
            await this.room.switchActiveDevice('audiooutput', stageData.audioOutputId);
            await this.room.connect('ws://localhost:7880', token);
            await this.room.localParticipant.setCameraEnabled(stageData.isVideoEnabled);
            await this.room.localParticipant.setMicrophoneEnabled(stageData.isMicrophoneEnabled);
            this.isRoomConnected.set(true);
          } catch (e) {
            console.error('Failed to connect to room', e);
            this.isRoomConnected.set(false);
          }
        },
        error: (err) => {
          console.error('Failed to connect to room', err);
          this.isRoomConnected.set(false);
        },
      });
  }

  redirectBack() {
    this.router.navigate(['/']);
  }

  private handleRoomDisconnected = (reason?: DisconnectReason) => {
    this.isRoomConnected.set(false);
    if (reason) {
      switch (reason) {
        case DisconnectReason.CLIENT_INITIATED:
          this.disconnectedReason.set('You left the meeting');
          break;
        case DisconnectReason.PARTICIPANT_REMOVED:
          this.disconnectedReason.set('You were removed from the meeting');
          break;
        case DisconnectReason.ROOM_DELETED:
          this.disconnectedReason.set('Room deleted');
          break;
        case DisconnectReason.ROOM_CLOSED:
          this.disconnectedReason.set('Room closed');
          break;
        default:
          this.disconnectedReason.set('Unknown disconnect reason');
          break;
      }
    } else {
      this.disconnectedReason.set('Unknown disconnect reason');
    }
  }
}
