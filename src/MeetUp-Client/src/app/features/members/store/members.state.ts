import { WorkspaceMember } from '../models/member.model';
import { PagedList } from '../models/paged-list.model';

export interface MembersState {
  members: PagedList<WorkspaceMember> | null;
  loading: boolean;
  error: string | null;
}

export const initialState: MembersState = {
  members: null,
  loading: false,
  error: null,
};
