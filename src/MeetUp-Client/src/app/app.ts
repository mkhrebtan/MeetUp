import {AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, signal, ViewChild} from '@angular/core';
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
        class="flex-auto bg-black/20 p-4 min-h-0 flex flex-wrap content-center justify-center gap-2 overflow-hidden"
        #participantsContainer>
        @if (localParticipant()) {
          @for (participant of allParticipants(); track participant!.identity) {
            <app-participant-card [style.width.px]="calculatedLayout().cardWidth"
                                  [style.height.px]="calculatedLayout().cardHeight"
                                  [style.flex-shrink]="0"
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
export class App implements AfterViewInit, OnDestroy {
  roomName = signal('');
  localParticipant = signal<LocalParticipant | null>(null);
  remoteParticipants = signal<RemoteParticipant[]>([]);
  allParticipants = computed(() => [this.localParticipant(), ...this.remoteParticipants()]);
  @ViewChild('participantsContainer') participantsContainer!: ElementRef<HTMLElement>;
  calculatedLayout = signal<VideoLayout>({
    rows: 0,
    cols: 0,
    cardWidth: 0,
    cardHeight: 0,
    area: 0,
  });
  private http = inject(HttpClient);
  private resizeObserver?: ResizeObserver;

  constructor() {
    // Watch for changes in participant count and trigger layout recalculation
    // effect(() => {
    //   // Read the signal to establish dependency (triggers effect when participants change)
    //
    //   // Only recalculate if we have a container element (after view init)
    //   if (this.allParticipants().length > 0 && this.participantsContainer?.nativeElement) {
    //     const {width, height} = this.participantsContainer.nativeElement.getBoundingClientRect();
    //     this.recalculateLayout(width, height);
    //   }
    // });
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

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

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

      this.recalculateLayout();
    }
  }

  handleTrackUnsubscribed = (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
    this.remoteParticipants.update(prev => prev.filter(p => p.identity !== participant.identity));
    this.recalculateLayout();
  }

  recalculateLayout() {
    const container = this.participantsContainer.nativeElement.getBoundingClientRect();
    const width = container.width - 16;
    const height = container.height - 16;

    if (!width || !height || !this.allParticipants().length) return;

    const gap = 8; // Tailwind gap-2
    const layout = this.calculateOptimalLayout(width, height, this.allParticipants().length, 16 / 9, gap);

    this.calculatedLayout.set(layout);
  }

  private calculateOptimalLayout(
    containerWidth: number,
    containerHeight: number,
    participantCount: number,
    aspectRatio: number = 16 / 9,
    gap: number = 0
  ): VideoLayout {
    let maxWidth = 0;

    for (let width = 1; width <= containerWidth; width++) {
      if (!this.canFitCards(width, aspectRatio, containerWidth, containerHeight, participantCount, gap)) {
        maxWidth = width - 1;
        break;
      }
    }

    maxWidth = maxWidth || containerWidth;

    const cardWidth = Math.floor(maxWidth) - gap;
    const cardHeight = Math.floor(cardWidth / aspectRatio) - gap;
    const cols = Math.floor((containerWidth + gap) / (cardWidth + gap));
    const rows = Math.ceil(participantCount / cols);

    return {rows, cols, cardWidth, cardHeight, area: cardWidth * cardHeight};
  }

  private canFitCards(
    cardWidth: number,
    aspectRatio: number,
    containerWidth: number,
    containerHeight: number,
    participantCount: number,
    gap: number
  ): boolean {
    const cardHeight = cardWidth / aspectRatio;
    const cardsPerRow = Math.floor((containerWidth + gap) / (cardWidth + gap));

    if (!cardsPerRow) return false;

    const rowsNeeded = Math.ceil(participantCount / cardsPerRow);
    const totalHeight = rowsNeeded * cardHeight + (rowsNeeded - 1) * gap;

    return totalHeight <= containerHeight;
  }
}

interface VideoLayout {
  rows: number;
  cols: number;
  cardWidth: number;
  cardHeight: number;
  area: number;
}
