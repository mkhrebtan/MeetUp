export interface MeetingModel {
  id: string;
  title: string;
  description?: string;
  scheduledAt: Date;
  duration: number;
  participants: number;
  isActive: boolean;
}
