import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Workspace } from '../models/workspace.model';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private apiService = inject(ApiService);

  loadWorkspace(id: string) {
    return this.apiService.get<Workspace>(`workspace/${id}`);
  }

  createWorkspace(name: string) {
    return this.apiService.post<Workspace>('workspace', { name });
  }

  joinWorkspace(inviteCode: string) {
    return this.apiService.post<Workspace>('workspace/join', { inviteCode });
  }

  updateSettings(
    id: string,
    name: string,
    invitationPolicy: string,
    meetingsCreationPolicy: string,
  ) {
    return this.apiService.patch<Workspace>(`workspace/${id}`, {
      name,
      invitationPolicy,
      meetingsCreationPolicy,
    });
  }

  leaveWorkspace(id: string) {
    return this.apiService.delete<void>(`workspace/${id}/leave`);
  }

  deleteWorkspace(id: string) {
    return this.apiService.delete<void>(`workspace/${id}`);
  }
}
