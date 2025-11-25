import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card],
})
export class DashboardComponent {
  stats = [
    { label: 'Meetings This Week', value: '12', icon: 'pi pi-calendar' },
    { label: 'Total Hours', value: '8.5', icon: 'pi pi-clock' },
    { label: 'Active Members', value: '24', icon: 'pi pi-users' },
  ];

  upcomingMeetings = [
    {
      id: 1,
      title: 'Product Design Review',
      time: 'Today, 2:00 PM',
      duration: '45 min',
      participants: 5,
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Engineering Standup',
      time: 'Today, 4:30 PM',
      duration: '15 min',
      participants: 8,
      status: 'upcoming',
    },
    {
      id: 3,
      title: 'Client Presentation',
      time: 'Tomorrow, 10:00 AM',
      duration: '60 min',
      participants: 3,
      status: 'scheduled',
    },
  ];

  recentRecords = [
    {
      id: 1,
      title: 'Q4 Planning Session',
      date: 'Dec 18, 2024',
      duration: '1h 23m',
      views: 12,
    },
    {
      id: 2,
      title: 'Marketing Strategy Meeting',
      date: 'Dec 17, 2024',
      duration: '52m',
      views: 8,
    },
    {
      id: 3,
      title: 'Team Retrospective',
      date: 'Dec 15, 2024',
      duration: '1h 5m',
      views: 15,
    },
  ];
}
