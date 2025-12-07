import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import videojs from 'video.js';

@Component({
  selector: 'app-vjs-player',
  templateUrl: 'vjs-player.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class VjsPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('target', { static: true }) target!: ElementRef<HTMLVideoElement>;

  @Input() options!: {
    controls?: boolean;
    autoplay?: boolean | 'muted';
    fluid?: boolean;
    aspectRatio?: string;
    sources: { src: string; type: string }[];
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player!: any;

  ngOnInit(): void {
    this.player = videojs(this.target.nativeElement, this.options);
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
