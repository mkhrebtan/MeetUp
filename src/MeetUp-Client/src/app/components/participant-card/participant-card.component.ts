import {AfterViewInit, Component, ElementRef, input, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {
  LocalParticipant,
  LocalTrackPublication,
  ParticipantEvent,
  RemoteParticipant,
  Track,
  TrackPublication,
  VideoTrack
} from 'livekit-client';
import {Chip} from 'primeng/chip';
import {ParticipantVideoComponent} from "../participant-video/participant-video.component";

@Component({
  selector: 'app-participant-card',
  standalone: true,
  imports: [
    Chip,
    ParticipantVideoComponent
  ],
  template: `
    <div class="w-full h-full relative rounded-xl overflow-hidden shadow-xl"
         [class.border-2]="isSpeaking()"
         [class.border-green-400]="isSpeaking()">
      @if (isVideoEnabled() && participant().identity) {
        <p-chip
          class="absolute bottom-2 !bg-neutral-900/50 border border-white/20 !text-white left-2 !py-1 z-10 animate-fadein"
          [label]="participant().identity"></p-chip>
      }

      <audio
        autoplay
        #audioElement
      ></audio>

      <app-participant-video
        [videoTrack]="videoTrack()"
        [isVideoEnabled]="isVideoEnabled()"
        [isLocal]="isLocal()"
        [identity]="participant().identity"
      />
    </div>
  `,
  styles: ``,
})
export class ParticipantCardComponent implements OnInit, OnDestroy, AfterViewInit {
  participant = input.required<LocalParticipant | RemoteParticipant>();
  isSpeaking = signal(false);
  isVideoEnabled = signal(false);
  videoTrack = signal<VideoTrack | null>(null);
  isLocal = signal(false);

  @ViewChild('audioElement') audioElement!: ElementRef;

  ngOnInit() {
    this.isLocal.set(this.participant() instanceof LocalParticipant);

    this.participant()
      .on(ParticipantEvent.TrackSubscribed, this.handleTrackSubscribed)
      .on(ParticipantEvent.TrackUnsubscribed, this.handleTrackUnsubscribed)
      .on(ParticipantEvent.LocalTrackPublished, this.handleLocalTrackPublished)
      .on(ParticipantEvent.LocalTrackUnpublished, this.handleLocalTrackUnpublished)
      .on(ParticipantEvent.TrackMuted, this.handleTrackMuted)
      .on(ParticipantEvent.TrackUnmuted, this.handleTrackUnmuted)
      .on(ParticipantEvent.IsSpeakingChanged, this.handleSpeakingChanged);
  }

  ngAfterViewInit() {
    this.participant().getTrackPublications().filter(t => t.kind === Track.Kind.Video).forEach((pub) => {
      if (pub.track) {
        this.handleTrackSubscribed(pub.track, pub);
      }
    });
    this.participant().getTrackPublications().filter(t => t.kind === Track.Kind.Audio).forEach((pub) => {
      if (pub.track) {
        this.handleTrackSubscribed(pub.track, pub);
      }
    });
  }

  ngOnDestroy() {
    this.participant()
      .off(ParticipantEvent.TrackSubscribed, this.handleTrackSubscribed)
      .off(ParticipantEvent.TrackUnsubscribed, this.handleTrackUnsubscribed)
      .off(ParticipantEvent.LocalTrackPublished, this.handleLocalTrackPublished)
      .off(ParticipantEvent.LocalTrackUnpublished, this.handleLocalTrackUnpublished)
      .off(ParticipantEvent.TrackMuted, this.handleTrackMuted)
      .off(ParticipantEvent.TrackUnmuted, this.handleTrackUnmuted)
      .off(ParticipantEvent.IsSpeakingChanged, this.handleSpeakingChanged);

    const audioTrack = this.participant().getTrackPublication(Track.Source.Microphone)?.track;
    if (audioTrack) {
      audioTrack.detach();
    }
  }

  private handleTrackSubscribed = (track: Track, pub: TrackPublication) => {
    if (track.kind === Track.Kind.Video) {
      this.videoTrack.set(track as VideoTrack);
      this.isVideoEnabled.set(!track.isMuted);
    } else if (track.kind === Track.Kind.Audio) {
      if (this.participant() instanceof RemoteParticipant) {
        track.attach(this.audioElement.nativeElement);
      }
    }
  };

  private handleTrackUnsubscribed = (track: Track, pub: TrackPublication) => {
    if (track.kind === Track.Kind.Video) {
      this.videoTrack.set(null);
      this.isVideoEnabled.set(false);
    } else if (track.kind === Track.Kind.Audio) {
      track.detach();
    }
  };

  private handleLocalTrackPublished = (pub: LocalTrackPublication) => {
    if (pub.kind === Track.Kind.Video) {
      this.videoTrack.set(pub.track as VideoTrack);
      this.isVideoEnabled.set(pub.track!.isMuted);
    }
  };

  private handleLocalTrackUnpublished = (pub: LocalTrackPublication) => {
    if (pub.kind === Track.Kind.Video) {
      this.videoTrack.set(null);
      this.isVideoEnabled.set(false);
    }
  };

  private handleTrackMuted = (pub: TrackPublication) => {
    if (pub.kind === Track.Kind.Video) {
      this.isVideoEnabled.set(false);
    }
  };

  private handleTrackUnmuted = (pub: TrackPublication) => {
    if (pub.kind === Track.Kind.Video) {
      this.isVideoEnabled.set(true);
    }
  };

  private handleSpeakingChanged = (isSpeaking: boolean) => {
    this.isSpeaking.set(isSpeaking);
  };
}
