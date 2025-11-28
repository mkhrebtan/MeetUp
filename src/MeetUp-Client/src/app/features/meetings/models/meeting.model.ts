export interface Meeting {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: string;
  participants: number;
  isActive: boolean;
  inviteCode: string;
}

export interface PagedList<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateMeetingRequest {
  title: string;
  description?: string;
  scheduledAt: string;
  duration: string;
  workspaceId: string;
  screenSharePolicy: string;
  recordingPolicy: string;
  chatPolicy: string;
  participants: string[];
}
