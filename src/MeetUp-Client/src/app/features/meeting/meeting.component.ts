import { Component, inject, OnDestroy, signal, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadMeeting } from './store/meeting.actions';
import { selectMeeting, selectMeetingError, selectMeetingLoading } from './store/meeting.selectors';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConnectionState, DisconnectReason, Room, RoomEvent } from 'livekit-client';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MeetingService } from './services/meeting.service';
import { LivekitService } from './services/livekit.service';
import { RoomStageDataModel } from './models/room-stage-data.model';
import { MeetingRoomComponent } from './components/meeting-room/meeting-room.component';
import { MeetingStageComponent } from './components/meeting-stage/meeting-stage.component';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-meeting',
  imports: [
    FormsModule,
    InputTextModule,
    MeetingRoomComponent,
    MeetingStageComponent,
    Button,
    ProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './meeting.component.html',
  styles: [],
})
export class MeetingComponent implements OnDestroy, OnInit {
  room: Room = new Room({
    adaptiveStream: true,
    dynacast: true,
    publishDefaults: {
      videoCodec: 'av1',
    },
  });
  meetingId = '';
  isRoomConnected = signal(false);
  isRejoin = signal(false);
  disconnectedReason = signal<string | undefined>(undefined);
  private meetingService = inject(MeetingService);
  private livekitService = inject(LivekitService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private store = inject(Store);
  meeting = this.store.selectSignal(selectMeeting);
  isLoading = this.store.selectSignal(selectMeetingLoading);
  error = this.store.selectSignal(selectMeetingError);

  ngOnInit() {
    this.room.on(RoomEvent.Disconnected, this.handleRoomDisconnected);
    this.meetingId = this.route.snapshot.paramMap.get('meetingId') ?? '';
    if (this.meetingId) {
      this.store.dispatch(loadMeeting({ meetingId: this.meetingId }));
    }
  }

  async ngOnDestroy() {
    this.room.off(RoomEvent.Disconnected, this.handleRoomDisconnected);
    if (this.room.state !== ConnectionState.Disconnected) {
      await this.room.disconnect();
    }
  }

  connectToRoom(stageData: RoomStageDataModel) {
    this.meetingService.getRoomToken(this.meetingId).subscribe({
      next: async (response) => {
        const token = response.accessToken;
        try {
          await this.room.switchActiveDevice('audioinput', stageData.audioInputId);
          await this.room.switchActiveDevice('videoinput', stageData.videoInputId);
          await this.room.switchActiveDevice('audiooutput', stageData.audioOutputId);
          await this.room.connect(this.livekitService.livekitUrl, token);
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

  private handleRoomDisconnected = (reason?: DisconnectReason) => {
    this.isRoomConnected.set(false);
    if (reason) {
      switch (reason) {
        case DisconnectReason.CLIENT_INITIATED:
          this.disconnectedReason.set('You left the meeting');
          this.isRejoin.set(true);
          break;
        case DisconnectReason.PARTICIPANT_REMOVED:
          this.disconnectedReason.set('You were removed from the meeting');
          this.isRejoin.set(false);
          break;
        case DisconnectReason.ROOM_DELETED:
          this.disconnectedReason.set('The meeting has been ended');
          this.isRejoin.set(this.meeting()?.isHost ?? false);
          break;
        case DisconnectReason.ROOM_CLOSED:
          this.disconnectedReason.set('The meeting has been ended');
          this.isRejoin.set(this.meeting()?.isHost ?? false);
          break;
        default:
          this.disconnectedReason.set('Unknown disconnect reason');
          this.isRejoin.set(false);
          break;
      }
    } else {
      this.disconnectedReason.set('Unknown disconnect reason');
      this.isRejoin.set(false);
    }
  };
}
