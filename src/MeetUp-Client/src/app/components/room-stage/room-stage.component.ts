import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, output, signal, ViewChild} from '@angular/core';
import {Button} from 'primeng/button';
import {createLocalAudioTrack, createLocalVideoTrack, LocalAudioTrack, LocalVideoTrack, Room} from 'livekit-client';
import {Select} from 'primeng/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RoomStageData} from '../../models/room-stage-data';

@Component({
  selector: 'app-room-stage',
  template: `
    <div class="flex flex-col lg:flex-row w-full h-screen items-center justify-center p-6 lg:p-25 gap-6">
      <div class="flex md:flex-2 xl:flex-1 flex-col items-center gap-4">
        <div class="w-full aspect-[4/3] relative rounded-xl overflow-hidden shadow-xl">
          <audio
            autoplay
            #audioElement
          ></audio>
          <div class="bg-neutral-950 w-full h-full">
            <video
              class="w-full h-full rotate-y-180 object-cover"
              [hidden]="!isVideoEnabled()"
              autoplay
              playsinline
              muted
              #videoElement
            ></video>
            @if (!isVideoEnabled()) {
              <div class="w-full h-full flex items-center justify-center z-10">
                <p class="text-4xl text-neutral-400 px-4 truncate max-w-full">
                  Camera is off
                </p>
              </div>
            }
          </div>
        </div>
        <div class="w-full flex gap-2 justify-center">
          <p-button icon="pi pi-microphone" size="large" (click)="toggleAudio()"
                    [severity]="isMicrophoneEnabled() ? 'secondary' : 'danger'" [disabled]="isMicrophoneMissing()"/>
          <p-button icon="pi pi-video" size="large" (click)="toggleVideo()"
                    [severity]="isVideoEnabled() ? 'secondary' : 'danger'" [disabled]="isVideoMissing()"/>
        </div>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center gap-6">
        <p-button label="Join room" severity="info" size="large" (click)="onRoomJoin()"/>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex flex-col items-center gap-2">
            <p-select [options]="audioInputs" [(ngModel)]="selectedAudioInputId"
                      (onChange)="changeAudioDevice($event.value)" optionLabel="label"
                      optionValue="deviceId" size="small" fluid/>
            <i class="pi pi-microphone text-white"></i>
          </div>
          <div class="flex flex-col items-center gap-2">
            <p-select [options]="audioOutputs" [(ngModel)]="selectedAudioOutputId"
                      (onChange)="changeAudioDevice($event.value)" optionLabel="label"
                      optionValue="deviceId" size="small" fluid/>
            <i class="pi pi-headphones text-white"></i>
          </div>
          <div class="flex flex-col items-center gap-2">
            <p-select [options]="videoInputs" [(ngModel)]="selectedVideoInputId"
                      (onChange)="changeAudioDevice($event.value)" optionLabel="label"
                      optionValue="deviceId" size="small" fluid/>
            <i class="pi pi-video text-white"></i>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  imports: [
    Button,
    Select,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class RoomStageComponent implements OnInit, AfterViewInit, OnDestroy {
  isMicrophoneMissing = signal(false);
  isMicrophoneEnabled = signal(false);
  isVideoMissing = signal(false);
  isVideoEnabled = signal(false);
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('audioElement') audioElement!: ElementRef;
  audioTrack: LocalAudioTrack | null = null;
  videoTrack: LocalVideoTrack | null = null;
  audioInputs: MediaDeviceInfo[] = [];
  videoInputs: MediaDeviceInfo[] = [];
  audioOutputs: MediaDeviceInfo[] = [];
  selectedAudioInputId: string = 'default';
  selectedVideoInputId: string = 'default';
  selectedAudioOutputId: string = 'default';
  joinRoom = output<RoomStageData>();

  async ngOnInit() {
    await this.loadDevices();
    this.selectedVideoInputId = this.videoInputs[0]?.deviceId ?? 'default';
  }

  async ngAfterViewInit() {
    await this.createAudioTrack();
    await this.createVideoTrack();
  }

  ngOnDestroy() {
    this.cleanupTracks();
  }

  async toggleAudio() {
    this.isMicrophoneEnabled.set(!this.isMicrophoneEnabled());
  }

  async toggleVideo() {
    this.isVideoEnabled.set(!this.isVideoEnabled());
    if (this.isVideoEnabled()) {
      this.videoTrack?.attach(this.videoElement.nativeElement);
    } else {
      this.videoTrack?.detach();
    }
  }

  async changeAudioDevice(deviceId: string) {
    await this.createAudioTrack(deviceId);
  }

  onRoomJoin() {
    const data: RoomStageData = {
      isMicrophoneEnabled: this.isMicrophoneEnabled(),
      isVideoEnabled: this.isVideoEnabled(),
      videoInputId: this.selectedVideoInputId,
      audioInputId: this.selectedAudioInputId,
      audioOutputId: this.selectedAudioOutputId,
    };
    this.joinRoom.emit(data);
  }

  private async createAudioTrack(deviceId: string = 'default') {
    if (this.audioTrack) {
      this.audioTrack.stop();
      this.audioTrack.detach();
      this.audioTrack = null;
    }

    await createLocalAudioTrack({deviceId}).then((track) => {
      this.isMicrophoneEnabled.set(true);
      this.audioTrack = track;
    }).catch(reason => {
      console.error(reason);
      this.isMicrophoneEnabled.set(false);
      this.isMicrophoneMissing.set(true);
    });
  }

  private async createVideoTrack() {
    await createLocalVideoTrack().then((track) => {
      track.attach(this.videoElement.nativeElement);
      this.isVideoEnabled.set(true);
      this.videoTrack = track;
    }).catch(reason => {
      console.error(reason);
      this.isVideoEnabled.set(false);
      this.isVideoMissing.set(true);
    })
  }

  private async loadDevices() {
    this.audioInputs = await Room.getLocalDevices('audioinput');
    this.videoInputs = await Room.getLocalDevices('videoinput');
    this.audioOutputs = await Room.getLocalDevices('audiooutput');
  }

  private cleanupTracks() {
    if (this.videoTrack) {
      this.videoTrack.stop();
      this.videoTrack.detach();
      this.videoTrack = null;
    }
    if (this.audioTrack) {
      this.audioTrack.stop();
      this.audioTrack.detach();
      this.audioTrack = null;
    }
  }
}
