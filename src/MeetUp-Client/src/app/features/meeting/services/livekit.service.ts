import { inject, Injectable } from '@angular/core';
import { Room } from 'livekit-client';
import { DevicesModel } from '../models/devices.model';
import { environment } from '../../../../enviroments/enviroment';
import { ApiService } from '../../../core/services/api.service';
import { RoomMetadata } from '../models/room-metadata.model';

@Injectable({
  providedIn: 'root',
})
export class LivekitService {
  livekitUrl = environment.livekitUrl || 'ws://localhost:7880';
  private apiService = inject(ApiService);

  async loadDevices(): Promise<DevicesModel> {
    const devices = await Promise.all([
      Room.getLocalDevices('audioinput'),
      Room.getLocalDevices('videoinput'),
      Room.getLocalDevices('audiooutput'),
    ]);
    return {
      audioInputs: devices[0],
      videoInputs: devices[1],
      audioOutputs: devices[2],
    };
  }

  updateRoomMetadata(meetingId: string, metadata: RoomMetadata) {
    return this.apiService.put(`livekit/room/${meetingId}/metadata`, metadata);
  }

  deleteRoom(meetingId: string) {
    return this.apiService.delete(`livekit/room/${meetingId}`);
  }
}
