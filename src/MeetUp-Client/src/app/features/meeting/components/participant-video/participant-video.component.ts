import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { LocalVideoTrack, RemoteVideoTrack } from 'livekit-client';
import { NgOptimizedImage } from '@angular/common';
import { prominent } from 'color.js';

@Component({
  selector: 'app-participant-video',
  standalone: true,
  imports: [NgOptimizedImage],
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
          class="w-full h-full flex items-center justify-center z-10 absolute top-0 left-0 transition-all duration-500"
          [style.background]="backgroundGradient()"
        >
          @if (avatarUrl()) {
            <img [ngSrc]="avatarUrl()!" class="w-32 h-32 rounded-full object-cover" width="128" height="128" alt="Avatar" />
          } @else {
            <p class="text-4xl text-neutral-400 px-4 truncate max-w-full">
              @if (identity()) {
                {{ identity() }}
              } @else {
                Video disabled
              }
            </p>
          }
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
  avatarUrl = input<string | null>(null);
  objectFit = input<'cover' | 'contain'>('cover');
  backgroundColor = input<string>('#000000');

  backgroundGradient = signal<string>('linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)');

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoTrack'] && this.videoElement) {
      this.handleTrackChange(changes['videoTrack'].previousValue);
    }
  }

  async ngAfterViewInit() {
    this.videoElement.nativeElement.muted = this.isLocal();
    this.handleTrackChange(null);

    if (!this.avatarUrl()) return;

    try {
      const result = await prominent(this.avatarUrl()!, { amount: 4 });
      const colors = (Array.isArray(result) && Array.isArray(result[0]) ? result : [result]) as number[][];

      if (colors.length > 0) {
        const gradientStops = colors.map((c) => {
          const factor = 0.4; // Darken the colors
          const r = Math.round(c[0] * factor);
          const g = Math.round(c[1] * factor);
          const b = Math.round(c[2] * factor);
          return `rgb(${r}, ${g}, ${b})`;
        });

        if (gradientStops.length > 1) {
          this.backgroundGradient.set(`linear-gradient(135deg, ${gradientStops.join(', ')})`);
        } else {
          this.backgroundGradient.set(gradientStops[0]);
        }
      }
    } catch (e) {
      console.error('Error generating gradient:', e);
    }
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
