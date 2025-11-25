import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { LocalVideoTrack, RemoteVideoTrack } from 'livekit-client';

@Component({
  selector: 'app-participant-video',
  standalone: true,
  imports: [],
  template: `
    <div class="w-full h-full relative">
      <video
        class="w-full h-full"
        [class.rotate-y-180]="isLocal()"
        [style.object-fit]="objectFit()"
        playsinline
        #videoElement
      ></video>
      @if (!isVideoEnabled()) {
        <div
          class="bg-neutral-950  w-full h-full flex items-center justify-center z-10 absolute top-0 left-0"
        >
          <p class="text-4xl text-neutral-400 px-4 truncate max-w-full">
            @if (identity()) {
              {{ identity() }}
            } @else {
              Video disabled
            }
          </p>
        </div>
      }
    </div>
  `,
  styles: [],
})
export class ParticipantVideoComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  videoTrack = input<LocalVideoTrack | RemoteVideoTrack | null>();
  isVideoEnabled = input(true);
  isLocal = input(false);
  identity = input<string>('');
  objectFit = input<'cover' | 'contain'>('cover');

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoTrack'] && this.videoElement) {
      this.handleTrackChange(changes['videoTrack'].previousValue);
    }
  }

  ngAfterViewInit() {
    this.videoElement.nativeElement.muted = this.isLocal();
    this.handleTrackChange(null);
  }

  ngOnDestroy() {
    const track = this.videoTrack();
    if (track && this.videoElement) {
      track.detach(this.videoElement.nativeElement);
    }
  }

  private handleTrackChange(previousTrack: LocalVideoTrack | RemoteVideoTrack | null) {
    if (this.videoElement) {
      if (previousTrack) {
        previousTrack.detach(this.videoElement.nativeElement);
      }
      const newTrack = this.videoTrack();
      if (newTrack) {
        newTrack.attach(this.videoElement.nativeElement);
      }
    }
  }
}
