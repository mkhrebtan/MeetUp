import {AfterViewInit, Component, OnDestroy, OnInit, output, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {createLocalAudioTrack, createLocalVideoTrack, LocalAudioTrack, LocalVideoTrack} from 'livekit-client';
import {Select} from 'primeng/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RoomStageDataModel} from '../../models/room-stage-data.model';
import {ParticipantVideoComponent} from "../participant-video/participant-video.component";
import {DevicesModel} from '../../models/devices.model';
import {LivekitService} from '../../services/livekit/livekit.service';

@Component({
  selector: 'app-room-stage',
  template: `
    <div class="flex flex-col lg:flex-row w-full h-screen items-center justify-center p-25 gap-6">
      <div class="flex flex-1 flex-col items-center gap-4">
        <div class="w-3/4 aspect-video lg:w-full lg:aspect-[4/3] relative rounded-xl overflow-hidden shadow-xl">
          <app-participant-video [videoTrack]="videoTrack" [isVideoEnabled]="isVideoEnabled()"
                                 [isLocal]="true"/>
        </div>
        <div class="w-full flex gap-2 justify-center">
          <p-button icon="pi pi-microphone" size="large" (click)="toggleAudio()"
                    [severity]="isMicrophoneEnabled() ? 'secondary' : 'danger'" [disabled]="isMicrophoneMissing()"
                    [raised]="true"/>
          <p-button icon="pi pi-video" size="large" (click)="toggleVideo()"
                    [severity]="isVideoEnabled() ? 'secondary' : 'danger'" [disabled]="isVideoMissing()"
                    [raised]="true"/>
        </div>
      </div>
      <div class="flex-auto lg:flex-1 flex flex-col items-center justify-center gap-6">
        <p-button label="Join room" severity="info" size="large" [raised]="true" (click)="onRoomJoin()"
                  [loading]="isLoading()"/>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col items-center gap-2">
            <p-select [options]="devices.audioInputs" [(ngModel)]="selectedAudioInputId"
                      (onChange)="changeAudioInput($event.value)" optionLabel="label"
                      optionValue="deviceId" size="small" fluid/>
            <i class="pi pi-microphone"></i>
          </div>
          <div class="flex flex-col items-center gap-2">
            <p-select [options]="devices.audioOutputs" [(ngModel)]="selectedAudioOutputId"
                      (onChange)="changeAudioOutput($event.value)" optionLabel="label"
                      optionValue="deviceId" size="small" fluid/>
            <i class="pi pi-headphones"></i>
          </div>
          <div class="flex flex-col items-center gap-2">
            <p-select [options]="devices.videoInputs" [(ngModel)]="selectedVideoInputId"
                      (onChange)="changeVideoInput($event.value)" optionLabel="label"
                      optionValue="deviceId" size="small" fluid/>
            <i class="pi pi-video"></i>
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
    FormsModule,
    ParticipantVideoComponent
  ]
})
export class RoomStageComponent implements OnInit, AfterViewInit, OnDestroy {
  isMicrophoneMissing = signal(false);
  isMicrophoneEnabled = signal(false);
  isVideoMissing = signal(false);
  isVideoEnabled = signal(false);
  isLoading = signal(false);
  audioTrack: LocalAudioTrack | null = null;
  videoTrack: LocalVideoTrack | null = null;
  devices: DevicesModel = {
    audioInputs: [],
    audioOutputs: [],
    videoInputs: [],
  };
  selectedAudioInputId: string = 'default';
  selectedVideoInputId: string = 'default';
  selectedAudioOutputId: string = 'default';
  joinRoom = output<RoomStageDataModel>();

  constructor(private livekitService: LivekitService) {
  }

  async ngOnInit() {
    this.isLoading.set(true);
    this.devices = await this.livekitService.loadDevices();
    this.selectedAudioInputId = this.devices.audioInputs.find(i => i.deviceId === 'default')?.deviceId ?? this.devices.audioInputs[0].deviceId;
    this.selectedVideoInputId = this.devices.videoInputs.find(i => i.deviceId === 'default')?.deviceId ?? this.devices.videoInputs[0].deviceId;
    this.selectedAudioOutputId = this.devices.audioOutputs.find(i => i.deviceId === 'default')?.deviceId ?? this.devices.audioOutputs[0].deviceId;
  }

  async ngAfterViewInit() {
    await Promise.all([
      this.createAudioTrack(this.selectedAudioInputId),
      this.createVideoTrack(this.selectedVideoInputId)
    ]);
    this.isLoading.set(false);
  }

  ngOnDestroy() {
    this.cleanupTracks();
  }

  async toggleAudio() {
    if (!this.audioTrack) return;
    this.isMicrophoneEnabled.update(v => !v);
  }

  async toggleVideo() {
    if (!this.videoTrack) return;
    this.isVideoEnabled.update(v => !v);
    if (this.isVideoEnabled()) {
      await this.videoTrack.unmute();
    } else {
      await this.videoTrack.mute();
    }
  }

  async changeAudioInput(deviceId: string) {
    this.selectedAudioInputId = deviceId;
    await this.createAudioTrack(deviceId);
  }

  async changeVideoInput(deviceId: string) {
    this.selectedVideoInputId = deviceId;
    await this.videoTrack?.restartTrack({deviceId});
  }

  async changeAudioOutput(deviceId: string) {
    this.selectedAudioOutputId = deviceId;
  }

  onRoomJoin() {
    const data: RoomStageDataModel = {
      isMicrophoneEnabled: this.isMicrophoneEnabled(),
      isVideoEnabled: this.isVideoEnabled(),
      videoInputId: this.selectedVideoInputId,
      audioInputId: this.selectedAudioInputId,
      audioOutputId: this.selectedAudioOutputId,
    };
    this.joinRoom.emit(data);
  }

  private async createAudioTrack(deviceId: string) {
    if (this.audioTrack) {
      this.audioTrack.stop();
    }
    try {
      this.audioTrack = await createLocalAudioTrack({deviceId});
      this.isMicrophoneEnabled.set(true);
    } catch (e) {
      console.error(e);
      this.isMicrophoneEnabled.set(false);
      this.isMicrophoneMissing.set(true);
    }
  }

  private async createVideoTrack(deviceId: string) {
    if (this.videoTrack) {
      this.videoTrack.stop();
    }
    try {
      this.videoTrack = await createLocalVideoTrack({deviceId});
      this.isVideoEnabled.set(true);
    } catch (e) {
      console.error(e);
      this.isVideoEnabled.set(false);
      this.isVideoMissing.set(true);
    }
  }

  private cleanupTracks() {
    this.audioTrack?.stop();
    this.videoTrack?.stop();
  }
}
