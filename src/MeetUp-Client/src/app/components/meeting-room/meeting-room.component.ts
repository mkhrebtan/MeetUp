import {AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, signal, ViewChild} from '@angular/core';
import {
  DisconnectReason,
  LocalParticipant,
  ParticipantEvent,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
  TrackPublication
} from 'livekit-client';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ParticipantCard} from "../participant-card/participant-card";
import {Button} from "primeng/button";
import {ParticipantsSidebarComponent} from "./participants-sidebar.component";

@Component({
  selector: 'app-meeting-room',
  imports: [ParticipantCard, Button, ParticipantsSidebarComponent],
  template: `
    <div class="h-screen flex flex-col p-4 bg-neutral-900 gap-4">
      <section class="flex flex-auto gap-4 overflow-hidden">
        <div
          class="flex-auto flex flex-wrap content-center justify-center gap-2 overflow-hidden"
          #participantsContainer>
          @if (localParticipant()) {
            @for (participant of allParticipants(); track participant!.identity) {
              <app-participant-card [style.width.px]="calculatedLayout().cardWidth"
                                    [style.height.px]="calculatedLayout().cardHeight"
                                    [style.flex-shrink]="0"
                                    [participant]="participant!" class="animate-fadein"></app-participant-card>
            }
          }
        </div>
        @if (isParticipantsSidebarVisible()) {
          <app-participants-sidebar class="flex-shrink-0 w-70 animate-slidein" [participants]="allParticipants()"
                                    (close)="toggleParticipantsSidebar()"/>
        }
      </section>
      <div class="h-[1px] bg-neutral-800"></div>
      <section class="grid grid-cols-3 items-center gap-2 px-4">
        <div class="flex gap-2">
          <p-button icon="pi pi-microphone" size="large" (click)="toggleAudio()"
                    [severity]="microphoneEnabled() ? 'danger' : 'secondary'"/>
          <p-button icon="pi pi-video" size="large" (click)="toggleVideo()"
                    [severity]="videoEnabled() ? 'danger' : 'secondary'"/>
        </div>
        <div class="flex justify-center gap-2">
          <p-button icon="pi pi-users" size="large"
                    [severity]="isParticipantsSidebarVisible() ? 'contrast' : 'secondary'"
                    (click)="toggleParticipantsSidebar()"/>
          <p-button icon="pi pi-desktop" size="large" severity="secondary"/>
          <p-button icon="pi pi-stop-circle" size="large" severity="secondary"/>
        </div>
        <p class="text-white justify-self-end">{{ roomName() }}</p>
      </section>
    </div>
  `,
  styles: [],
})
export class MeetingRoomComponent implements AfterViewInit, OnDestroy {
  roomName = signal('');
  room = signal<Room | null>(null);
  localParticipant = signal<LocalParticipant | null>(null);
  remoteParticipants = signal<RemoteParticipant[]>([]);
  allParticipants = computed(() => [this.localParticipant()!, ...this.remoteParticipants()]);
  @ViewChild('participantsContainer') participantsContainer!: ElementRef<HTMLElement>;
  calculatedLayout = signal<VideoLayout>({
    cardWidth: 0,
    cardHeight: 0,
  });
  microphoneEnabled = signal(false);
  videoEnabled = signal(false);
  isParticipantsSidebarVisible = signal(false);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private resizeObserver?: ResizeObserver;

  constructor() {
    this.roomName.set(this.route.snapshot.paramMap.get('roomName') ?? '');
    this.joinRoom();
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
    this.room()?.disconnect();
  }

  getToken(roomName: string) {
    return this.http.post<{ token: string }>('https://localhost:7014/LiveKit/token', {
      identity: `user-${Math.floor(Math.random() * 100)}`,
      room: roomName
    });
  }

  async joinRoom() {
    this.getToken(this.roomName())
      .subscribe({
        next: async response => {
          const room = new Room({
            adaptiveStream: true,
            dynacast: true,
          });
          room
            .on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed)
            .on(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed);
          // .on(RoomEvent.Disconnected, this.handleDisconnected);
          try {
            await room.connect('ws://localhost:7880', response.token);
            await room.localParticipant.enableCameraAndMicrophone();
            await room.localParticipant.setCameraEnabled(false);
            await room.localParticipant.setMicrophoneEnabled(false);
            room.localParticipant
              ?.on(ParticipantEvent.TrackMuted, this.handleTrackMuted)
              ?.on(ParticipantEvent.TrackUnmuted, this.handleTrackUnmuted);
            this.room.set(room);
            this.localParticipant.set(room.localParticipant);
          } catch (e) {
            console.error('Failed to connect to room', e);
            this.router.navigate(['/']);
          }
        },
        error: err => {
          console.error('Failed to get token', err);
          this.router.navigate(['/']);
        }
      });
  }

  async toggleVideo() {
    await this.localParticipant()?.setCameraEnabled(!this.localParticipant()?.isCameraEnabled);
  }

  async toggleAudio() {
    await this.localParticipant()?.setMicrophoneEnabled(!this.localParticipant()?.isMicrophoneEnabled);
  }

  toggleParticipantsSidebar() {
    this.isParticipantsSidebarVisible.update(prev => !prev);
  }

  handleTrackSubscribed = (_track: RemoteTrack, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
    if (_track.kind === Track.Kind.Video || _track.kind === Track.Kind.Audio) {
      const existingParticipant = this.remoteParticipants().find(p => p.identity === participant.identity);
      if (existingParticipant) {
        this.remoteParticipants.update(prev => prev.map(p => p.identity === participant.identity ? participant : p));
      } else {
        this.remoteParticipants.update(prev => [...prev, participant]);
      }

      this.recalculateLayout();
    }
  }

  handleTrackUnsubscribed = (_track: RemoteTrack, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
    this.remoteParticipants.update(prev => prev.filter(p => p.identity !== participant.identity));
    this.recalculateLayout();
  }

  handleTrackMuted = (pub: TrackPublication) => {
    if (pub.kind === Track.Kind.Video) {
      this.videoEnabled.set(false);
    } else if (pub.kind === Track.Kind.Audio) {
      this.microphoneEnabled.set(false);
    }
  };

  handleTrackUnmuted = (pub: TrackPublication) => {
    if (pub.kind === Track.Kind.Video) {
      this.videoEnabled.set(true);
    } else if (pub.kind === Track.Kind.Audio) {
      this.microphoneEnabled.set(true);
    }
  };

  handleDisconnected = (reason?: DisconnectReason) => {
    console.log('Disconnected from room: ', reason);
    this.room.set(null);
    this.localParticipant.set(null);
    this.remoteParticipants.set([]);
    this.isParticipantsSidebarVisible.set(false);
    this.microphoneEnabled.set(false);
    this.videoEnabled.set(false);
    if (reason !== DisconnectReason.CLIENT_INITIATED) {
      this.router.navigate(['/']);
    }
  }

  recalculateLayout() {
    const container = this.participantsContainer.nativeElement.getBoundingClientRect();
    const width = container.width;
    const height = container.height - 8;

    if (!width || !height || !this.allParticipants().length) return;

    const gap = 8;
    const layout = this.calculateOptimalLayout(width, height, this.allParticipants().length, 4 / 3, gap);

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

    return {cardWidth, cardHeight};
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
  cardWidth: number;
  cardHeight: number;
}
