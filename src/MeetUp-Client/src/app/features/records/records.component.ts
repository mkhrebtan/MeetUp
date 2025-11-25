import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconField, InputIcon, InputText, Button, Card],
})
export class RecordsComponent {
  records = [
    {
      id: '1',
      title: 'Q4 Planning Session',
      date: '2024-12-18',
      duration: '1h 23m',
      views: 12,
      owner: 'You',
      thumbnail: '/placeholder.svg?key=azyt4',
      size: '342 MB',
      sharedWith: 5,
    },
    {
      id: '2',
      title: 'Marketing Strategy Meeting',
      date: '2024-12-17',
      duration: '52m',
      views: 8,
      owner: 'Sarah Miller',
      thumbnail: '/placeholder.svg?key=1c9d6',
      size: '198 MB',
      sharedWith: 3,
    },
    {
      id: '3',
      title: 'Team Retrospective',
      date: '2024-12-15',
      duration: '1h 5m',
      views: 15,
      owner: 'You',
      thumbnail: '/placeholder.svg?key=dgpgz',
      size: '285 MB',
      sharedWith: 8,
    },
    {
      id: '4',
      title: 'Client Presentation - Acme',
      date: '2024-12-14',
      duration: '45m',
      views: 6,
      owner: 'Mike Johnson',
      thumbnail: '/placeholder.svg?key=dfzmk',
      size: '167 MB',
      sharedWith: 2,
    },
    {
      id: '5',
      title: 'Engineering Deep Dive',
      date: '2024-12-12',
      duration: '2h 15m',
      views: 24,
      owner: 'You',
      thumbnail: '/placeholder.svg?key=pxcph',
      size: '512 MB',
      sharedWith: 12,
    },
    {
      id: '6',
      title: 'Design Review - Mobile App',
      date: '2024-12-10',
      duration: '1h 10m',
      views: 18,
      owner: 'Alice Chen',
      thumbnail: '/placeholder.svg?key=rl9h8',
      size: '298 MB',
      sharedWith: 6,
    },
  ];
}
