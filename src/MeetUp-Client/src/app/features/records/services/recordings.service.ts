import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

export interface Recording {
  key: string;
  fileName: string;
  createdAt: string;
  duration: string;
}

interface GetRecordingsResponse {
  recordings: Recording[];
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
}
