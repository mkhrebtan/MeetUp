import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {
  LocalParticipant,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track
} from 'livekit-client';
import {ParticipantCard} from './components/participant-card/participant-card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ParticipantCard],
  template: `
    <h1 class="text-xl">Welcome to {{ title() }}!</h1>
    <button (click)="getToken()">Get Token</button>
    <button (click)="joinRoom()">Join Room</button>
    <p>Token: {{ token() }}</p>
    <p>Room: {{ roomName() }}</p>

    <div class="video-container flex flex-wrap justify-center" id="video-container">
      @if (localParticipant()) {
        <app-participant-card [participant]="localParticipant()!"></app-participant-card>
      }
      @for (remoteParticipant of remoteParticipants(); track remoteParticipant.identity) {
        <app-participant-card [participant]="remoteParticipant"></app-participant-card>
      }
    </div>
    <button (click)="toggleVideo()">Camera</button>
    <button (click)="toggleAudio()">Micro</button>
    <router-outlet/>
  `,
  styles: [],
})
export class App {
  token = signal('');
  roomName = signal('');
  localParticipant = signal<LocalParticipant | null>(null);
  remoteParticipants = signal<RemoteParticipant[]>([]);
  protected readonly title = signal('MeetUp-Client');
  private http = inject(HttpClient);

  getToken() {
    this.http.post<{ token: string }>('https://localhost:7014/LiveKit/token', {
      identity: `user-${Math.random()}`,
      room: "test-room"
    })
      .subscribe({
        next: response => {
          this.token.set(response.token);
        },
        error: err => {
          throw err;
        }
      })
  }

  async joinRoom() {
    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
    });
    room
      .on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed)
      .on(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed);
    await room.connect('ws://localhost:7880', this.token());
    this.roomName.set(room.name);
    await room.localParticipant.enableCameraAndMicrophone();
    await room.localParticipant.setCameraEnabled(false);
    await room.localParticipant.setMicrophoneEnabled(false);
    this.localParticipant.set(room.localParticipant);
  }

  async toggleVideo() {
    await this.localParticipant()?.setCameraEnabled(!this.localParticipant()?.isCameraEnabled);
  }

  async toggleAudio() {
    await this.localParticipant()?.setMicrophoneEnabled(!this.localParticipant()?.isMicrophoneEnabled);
  }

  handleTrackSubscribed = (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
    if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
      const existingParticipant = this.remoteParticipants().find(p => p.identity === participant.identity);
      if (existingParticipant) {
        this.remoteParticipants.update(prev => prev.map(p => p.identity === participant.identity ? participant : p));
      } else {
        this.remoteParticipants.update(prev => [...prev, participant]);
      }
    }
  }

  handleTrackUnsubscribed = (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
    this.remoteParticipants.update(prev => prev.filter(p => p.identity !== participant.identity));
  }
}
