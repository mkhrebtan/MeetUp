import {AfterViewInit, Component, ElementRef, input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LocalParticipant, ParticipantEvent, RemoteParticipant, Track, TrackPublication} from 'livekit-client';

@Component({
  selector: 'app-participant-card',
  imports: [],
  template: `
    <div class="w-fit relative rounded-2xl overflow-hidden">
      <p class="absolute bottom-0 bg-black text-sm rounded-b-2xl text-white py-1 px-2 z-10"
         [class.text-green-500]="participant().isSpeaking">
        {{ participant().identity }}
      </p>

      <audio
        [id]="'remote-audio-' + participant().identity"
        autoplay
        #audioElement
      ></audio>

      <div class="bg-black">
        <video
          class="w-96 aspect-video rotate-y-180"
          [id]="'remote-video-' + participant().identity"
          autoplay
          playsinline
          #videoElement
        ></video>
      </div>
    </div>
  `,
  styles: ``,
})
export class ParticipantCard implements OnInit, OnDestroy, AfterViewInit {
  participant = input.required<LocalParticipant | RemoteParticipant>();
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
  };

  private handleTrackUnsubscribed = (track: Track, pub: TrackPublication) => {
    track.detach();
  };

  private handleTrackMuted = (pub: TrackPublication) => {
    if (pub.kind === Track.Kind.Video) {
    } else if (pub.kind === Track.Kind.Audio) {
    }
  };

  private handleTrackUnmuted = (pub: TrackPublication) => {
    if (pub.kind === Track.Kind.Video) {
    } else if (pub.kind === Track.Kind.Audio) {
    }
  };

  private handleSpeakingChanged = (isSpeaking: boolean) => {
    // You can use this to add a "speaking" indicator border
    // e.g., this.isSpeaking = isSpeaking;
    // this.cdr.detectChanges();
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
