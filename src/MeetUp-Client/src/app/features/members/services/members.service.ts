import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { WorkspaceMember } from '../models/member.model';
import { PagedList } from '../models/paged-list.model';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private apiService = inject(ApiService);

  getMembers(workspaceId: string, page = 1, pageSize = 10, search?: string) {
    const params: Record<string, string> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    if (search) {
      params['searchTerm'] = search;
    }

    return this.apiService.get<PagedList<WorkspaceMember>>(
      `workspace/${workspaceId}/members`,
      params,
    );
  }

  inviteMembers(workspaceId: string, emails: string[]) {
    return this.apiService.post(`workspace/${workspaceId}/invite`, { emails });
  }

  removeMember(workspaceId: string, email: string) {
    return this.apiService.delete(`workspace/${workspaceId}/members/${email}`);
  }

  updateMemberRole(userId: string, role: string) {
    return this.apiService.patch<WorkspaceMember>(`users/${userId}/role`, {
      role,
    });
  }
}
