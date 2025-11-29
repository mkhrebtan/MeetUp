import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface PresignedUrlResponse {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private apiService = inject(ApiService);
  private http = inject(HttpClient);

  getFileUploadUrl(fileName: string, contentType: string): Observable<PresignedUrlResponse> {
    const params = new HttpParams().set('fileName', fileName).set('contentType', contentType);
    return this.apiService.get<PresignedUrlResponse>('storage/file-upload-url', params);
  }

  uploadFile(presignedUrl: string, file: File): Observable<void> {
    return this.http.put<void>(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
        'x-amz-meta-file-name': file.name,
      },
    });
  }
}
