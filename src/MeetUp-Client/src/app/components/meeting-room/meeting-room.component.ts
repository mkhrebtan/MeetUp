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
  ViewChild
} from '@angular/core';
import {ConnectionState, RemoteParticipant, Room, RoomEvent} from 'livekit-client';
import {ParticipantCardComponent} from "../participant-card/participant-card.component";
import {Button} from "primeng/button";
import {ParticipantsSidebarComponent} from "../participants-sidebar/participants-sidebar.component";
import {LayoutService} from '../../services/layout/layout.service';
import {VideoLayout} from '../../models/video-layout';

@Component({
  selector: 'app-meeting-room',
  imports: [ParticipantCardComponent, Button, ParticipantsSidebarComponent],
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
      <section class="grid grid-cols-3 items-center gap-2 px-4">
        <div class="flex gap-2">
          <p-button icon="pi pi-microphone" size="large" (click)="toggleAudio()"
                    [severity]="isMicrophoneEnabled() ? 'secondary' : 'danger'"/>
          <p-button icon="pi pi-video" size="large" (click)="toggleVideo()"
                    [severity]="isVideoEnabled() ? 'secondary' : 'danger'"/>
        </div>
        <div class="flex justify-center gap-2">
          <p-button icon="pi pi-users" size="large"
                    [severity]="isParticipantsSidebarVisible() ? 'contrast' : 'secondary'"
                    (click)="toggleParticipantsSidebar()"/>
          <p-button icon="pi pi-desktop" size="large" severity="secondary"/>
          <p-button icon="pi pi-stop-circle" size="large" severity="secondary"/>
        </div>
        <div class="flex gap-4 items-center justify-self-end">
          <p class="text-white justify-self-end">{{ room().name }}</p>
          <p-button icon="pi pi-sign-out" severity="danger" (click)="disconnectFromRoom()" size="large"/>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export class MeetingRoomComponent implements OnInit, AfterViewInit, OnDestroy {
  room = input.required<Room>();
  remoteParticipants = signal<RemoteParticipant[]>([]);
  allParticipants = computed(() => [this.room().localParticipant, ...this.remoteParticipants()]);
  @ViewChild('participantsContainer') participantsContainer!: ElementRef<HTMLElement>;
  calculatedLayout = signal<VideoLayout>({
    cardWidth: 0,
    cardHeight: 0,
  });
  isMicrophoneEnabled = signal(false);
  isVideoEnabled = signal(false);
  isParticipantsSidebarVisible = signal(false);
  private resizeObserver?: ResizeObserver;
  private layoutService = inject(LayoutService);

  ngOnInit() {
    this.remoteParticipants.set([...this.room().remoteParticipants.values()]);
    this.room()
      .on(RoomEvent.ParticipantConnected, this.handleParticipantConnected)
      .on(RoomEvent.ParticipantDisconnected, this.handleParticipantDisconnected);
    this.isMicrophoneEnabled.set(this.room().localParticipant.isMicrophoneEnabled);
    this.isVideoEnabled.set(this.room().localParticipant.isCameraEnabled);
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
      .off(RoomEvent.ParticipantDisconnected, this.handleParticipantDisconnected);
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

  private handleParticipantConnected = (participant: RemoteParticipant) => {
    this.remoteParticipants.update(prev => [...prev, participant]);
  };

  private handleParticipantDisconnected = (participant: RemoteParticipant) => {
    this.remoteParticipants.update(prev => prev.filter(p => p.identity !== participant.identity));
  };
}
