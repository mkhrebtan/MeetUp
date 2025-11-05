import {AfterViewInit, Component, ElementRef, input, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {LocalParticipant, ParticipantEvent, RemoteParticipant, Track, TrackPublication} from 'livekit-client';
import {Chip} from 'primeng/chip';

@Component({
  selector: 'app-participant-card',
  imports: [
    Chip
  ],
  template: `
    <div class="w-full h-full relative rounded-xl overflow-hidden shadow-xl"
         [class.border-2]="isSpeaking()"
         [class.border-green-400]="isSpeaking()">
      @if (isCameraEnabled()) {
        <p-chip
          class="absolute bottom-2 !bg-neutral-900/50 border border-white/20 !text-white left-2 !py-1 z-10 animate-fadein"
          [label]="participant().identity"></p-chip>
      }

      <audio
        [id]="'remote-audio-' + participant().identity"
        autoplay
        #audioElement
      ></audio>

      <div class="bg-neutral-950 w-full h-full">
        <video
          class="w-full h-full rotate-y-180 object-cover"
          [id]="'remote-video-' + participant().identity"
          [hidden]="!isCameraEnabled()"
          autoplay
          playsinline
          muted
          #videoElement
        ></video>
        @if (!isCameraEnabled()) {
          <div class="w-full h-full flex items-center justify-center z-10 absolute top-0 left-0">
            <p class="text-4xl text-neutral-400 px-4 truncate max-w-full">
              {{ participant().identity }}
            </p>
          </div>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class ParticipantCard implements OnInit, OnDestroy, AfterViewInit {
  participant = input.required<LocalParticipant | RemoteParticipant>();
  isSpeaking = signal(false);
  isCameraEnabled = signal(false);
  @ViewChild('audioElement') audioElement!: ElementRef;
  @ViewChild('videoElement') videoElement!: ElementRef;

  ngOnInit() {
    this.participant()
      .on(ParticipantEvent.TrackSubscribed, this.handleTrackSubscribed)
      .on(ParticipantEvent.TrackUnsubscribed, this.handleTrackUnsubscribed)
      .on(ParticipantEvent.TrackMuted, this.handleTrackMuted)
      .on(ParticipantEvent.TrackUnmuted, this.handleTrackUnmuted)
      .on(ParticipantEvent.IsSpeakingChanged, this.handleSpeakingChanged);
  }

  ngAfterViewInit() {
    this.participant().getTrackPublications().forEach((pub) => {
      this.subscribeAndAttach(pub);
    });
  }

  ngOnDestroy() {
    this.participant()
      .off(ParticipantEvent.TrackSubscribed, this.handleTrackSubscribed)
      .off(ParticipantEvent.TrackUnsubscribed, this.handleTrackUnsubscribed)
      .off(ParticipantEvent.TrackMuted, this.handleTrackMuted)
      .off(ParticipantEvent.TrackUnmuted, this.handleTrackUnmuted)
      .off(ParticipantEvent.IsSpeakingChanged, this.handleSpeakingChanged);

    this.participant().getTrackPublications().forEach((pub) => {
      if (pub.track) {
        pub.track.detach();
      }
    });
  }

  private handleTrackSubscribed = (track: Track, pub: TrackPublication) => {
    this.attachTrack(track);
    if (track.kind === Track.Kind.Video) {
      this.isCameraEnabled.set(true);
    }
  };

  private handleTrackUnsubscribed = (track: Track, pub: TrackPublication) => {
    track.detach();
    if (track.kind === Track.Kind.Video) {
      this.isCameraEnabled.set(false);
    }
  };

  private handleTrackMuted = (pub: TrackPublication) => {
    if (pub.kind === Track.Kind.Video) {
      this.isCameraEnabled.set(false);
    }
  };

  private handleTrackUnmuted = (pub: TrackPublication) => {
    if (pub.kind === Track.Kind.Video) {
      this.isCameraEnabled.set(true);
    }
  };

  private handleSpeakingChanged = (isSpeaking: boolean) => {
    this.isSpeaking.set(isSpeaking);
  };

  private subscribeAndAttach(pub: TrackPublication) {
    if (pub.isSubscribed && pub.track) {
      // Already subscribed and track exists
      this.attachTrack(pub.track);
    }
  }

  private attachTrack(track: Track) {
    if (track.kind === Track.Kind.Video) {
      track.attach(this.videoElement.nativeElement);
    } else if (track.kind === Track.Kind.Audio && this.participant() instanceof RemoteParticipant) {
      track.attach(this.audioElement.nativeElement);
    }
  }
}
