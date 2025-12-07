import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

export interface Recording {
  key: string;
  fileName: string;
  createdAt: string;
  duration: string;
  title: string;
}

interface GetRecordingsResponse {
  recordings: Recording[];
}

interface GetRecordingUrlResponse {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecordingsService {
  private readonly apiService = inject(ApiService);

  getRecordings(): Observable<Recording[]> {
    return this.apiService
      .get<GetRecordingsResponse>('livekit/recordings')
      .pipe(map((response) => response.recordings));
  }

  getRecordingUrl(recordingKey: string): Observable<string> {
    const encodedRecordingKey = encodeURIComponent(recordingKey);
    return this.apiService
      .get<GetRecordingUrlResponse>(`livekit/recordings/${encodedRecordingKey}`)
      .pipe(map((response) => response.url));
  }

  shareRecording(storageKey: string, recipientIds: string[]): Observable<void> {
    return this.apiService.post<void>('livekit/recordings/share', { recipientIds, storageKey });
  }

  getMembersToShare(
    workspaceId: string,
    storageKey: string,
  ): Observable<{ id: string; fullName: string; avatarUrl?: string }[]> {
    const encodedKey = encodeURIComponent(storageKey);
    return this.apiService.get<{ id: string; fullName: string; avatarUrl?: string }[]>(
      `livekit/workspaces/${workspaceId}/recordings/${encodedKey}/members/without-access`,
    );
  }
}
