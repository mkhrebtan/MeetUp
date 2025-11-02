import {Component, computed, inject, signal} from '@angular/core';
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
import {Button} from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ParticipantCard, Button],
  template: `
    <div class="h-[100vh] !max-h-[100vh] flex flex-col bg-black/90">
      <p class="w-full text-center text-white">Room: {{ roomName() }}</p>
      <p-button (click)="joinRoom()" label="Join Room"></p-button>

      <section
        class="flex-auto bg-black/20 p-4 min-h-0 flex flex-wrap justify-center">
        @if (localParticipant()) {
          @for (participant of allParticipants(); track participant!.identity) {
            <app-participant-card [class]="cardDimensions()"
                                  [participant]="participant!"></app-participant-card>
          }
        }
      </section>
      <section class="flex justify-center gap-2 p-2">
        <p-button icon="pi pi-microphone" size="large" (click)="toggleAudio()"></p-button>
        <p-button icon="pi pi-video" size="large" (click)="toggleVideo()"></p-button>
      </section>
    </div>
    <router-outlet/>
  `,
  styles: [],
})
export class App {
  roomName = signal('');
  localParticipant = signal<LocalParticipant | null>(null);
  remoteParticipants = signal<RemoteParticipant[]>([]);
  allParticipants = computed(() => [this.localParticipant(), ...this.remoteParticipants()]);
  cardDimensions = computed(() => {
    const count = this.allParticipants().length;
    if (count === 1 || count === 2) return 'w-1/2 h-full';
    if (count === 3) return 'w-1/3 h-full';
    if (count <= 6) return 'w-1/3 h-1/2';
    if (count <= 8) return 'w-1/4 h-1/2';
    return 'w-1/4 h-1/3';
  });
  private http = inject(HttpClient);

  getToken() {
    return this.http.post<{ token: string }>('https://localhost:7014/LiveKit/token', {
      identity: `user-${Math.floor(Math.random() * 100)}`,
      room: "test-room"
    });
  }

  async joinRoom() {
    this.getToken()
      .subscribe({
        next: async response => {
          const room = new Room({
            adaptiveStream: true,
            dynacast: true,
          });
          room
            .on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed)
            .on(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed);
          await room.connect('ws://localhost:7880', response.token);
          this.roomName.set(room.name);
          await room.localParticipant.enableCameraAndMicrophone();
          await room.localParticipant.setCameraEnabled(false);
          await room.localParticipant.setMicrophoneEnabled(false);
          this.localParticipant.set(room.localParticipant);
        },
        error: err => {
          throw err;
        }
      });
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
