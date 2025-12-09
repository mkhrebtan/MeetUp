import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { recordsFeature } from './../store/records.reducer';
import { VjsPlayerComponent } from '../../../shared/components/video-player/vjs-player.component';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-record-player',
  standalone: true,
  imports: [VjsPlayerComponent, AsyncPipe, Button, RouterLink],
  template: `
    <div class="w-full p-6">
      <div class="mb-2">
        <p-button
          icon="pi pi-arrow-left"
          label="Back"
          routerLink=".."
          severity="secondary"
          size="small"
          text
        ></p-button>
      </div>
      <div class="h-full w-full flex items-center justify-center">
        @if (playingUrl$ | async; as url) {
          <app-vjs-player
            [options]="{
              autoplay: true,
              controls: true,
              fluid: true,
              sources: [{ src: url, type: 'video/mp4' }],
            }"
            class="w-full"
          />
        } @else {
          <div class="text-white">No video source provided</div>
        }
      </div>
    </div>
  `,
})
export class RecordPlayerComponent {
  private readonly store = inject(Store);
  playingUrl$ = this.store.select(recordsFeature.selectPlayingUrl);
}
