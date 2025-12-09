import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { WorkspaceSettings } from '../models/workspace-settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private apiService = inject(ApiService);

  updateWorkspaceSettings(settings: WorkspaceSettings) {
    const id = settings.workspaceId;
    const body = settings;
    return this.apiService.patch(`workspace/${id}`, body);
  }

  leaveWorkspace(id: string) {
    return this.apiService.delete(`workspace/${id}/leave`);
  }

  deleteWorkspace(id: string) {
    return this.apiService.delete(`workspace/${id}`);
  }
}
