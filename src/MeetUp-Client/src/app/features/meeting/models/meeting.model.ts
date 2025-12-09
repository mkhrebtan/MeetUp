export interface Meeting {
  id: string;
  workspaceId: string;
  title: string;
  isActive: boolean;
  isHost: boolean;
  chatEnabled: boolean;
  screenShareEnabled: boolean;
}
