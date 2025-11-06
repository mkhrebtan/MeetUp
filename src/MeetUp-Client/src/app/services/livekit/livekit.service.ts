import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LivekitService {
  private http = inject(HttpClient);

  getRoomToken(userIdentity: string, roomName: string) {
    return this.http.post<{ token: string }>('https://localhost:7014/LiveKit/token', {
      identity: userIdentity,
      room: roomName
    });
  }
}
