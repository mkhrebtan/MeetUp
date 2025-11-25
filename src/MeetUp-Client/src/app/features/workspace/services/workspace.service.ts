import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../../core/services/api.service';
import {Workspace} from '../models/workspace.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private apiService = inject(ApiService);

  loadWorkspace(id: string) {
    return this.apiService.get<Workspace>(`workspace/${id}`);
  }

  createWorkspace(name: string) {
    return this.apiService.post<{ workspace: Workspace }>('workspace', {name}).pipe(
      map(response => response.workspace)
    );
  }

  joinWorkspace(inviteCode: string) {
    return this.apiService.post<{ workspace: Workspace }>('workspace/join', {inviteCode}).pipe(
      map(response => response.workspace)
    );
  }
}
