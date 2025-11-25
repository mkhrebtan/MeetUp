import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Room } from 'livekit-client';
import { DevicesModel } from '../../models/devices.model';

@Injectable({
  providedIn: 'root',
})
export class LivekitService {
  private http = inject(HttpClient);

  getRoomToken(userIdentity: string, roomName: string) {
    return this.http.post<{ token: string }>('https://localhost:7014/LiveKit/token', {
      identity: userIdentity,
      room: roomName,
    });
  }

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
}
