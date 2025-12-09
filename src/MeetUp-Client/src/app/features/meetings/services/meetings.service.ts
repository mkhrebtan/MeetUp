import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateMeetingRequest, Meeting, PagedList } from '../models/meeting.model';
import { environment } from '../../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}workspace`;

  getHostedMeetings(
    workspaceId: string,
    page = 1,
    pageSize = 10,
    searchTerm?: string,
    passed = false,
  ): Observable<PagedList<Meeting>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('passed', passed);

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PagedList<Meeting>>(`${this.apiUrl}/${workspaceId}/meetings/hosted`, {
      params,
    });
  }

  getInvitedMeetings(
    workspaceId: string,
    page = 1,
    pageSize = 10,
    searchTerm?: string,
    passed = false,
  ): Observable<PagedList<Meeting>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('passed', passed);

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PagedList<Meeting>>(`${this.apiUrl}/${workspaceId}/meetings/invited`, {
      params,
    });
  }

  createMeeting(request: CreateMeetingRequest): Observable<string> {
    return this.http.post<string>(`${environment.apiUrl}meeting`, request);
  }

  deleteMeeting(meetingId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}meeting/${meetingId}`);
  }

  joinMeeting(inviteCode: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}meeting/join`, { inviteCode });
  }

  leaveMeeting(meetingId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}meeting/${meetingId}/leave`);
  }
}
