import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Button} from 'primeng/button';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {Card} from 'primeng/card';
import {Badge} from 'primeng/badge';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Button,
    IconField,
    InputIcon,
    InputText,
    Card,
    Badge
  ]
})
export class MembersComponent {
  members = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@company.com',
      role: 'Admin',
      status: 'active',
      avatar: 'JD',
      joinedDate: '2023-01-15',
      lastActive: 'Active now'
    },
    {
      id: '2',
      name: 'Sarah Miller',
      email: 'sarah@company.com',
      role: 'Member',
      status: 'active',
      avatar: 'SM',
      joinedDate: '2023-03-20',
      lastActive: '2 hours ago'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: 'Member',
      status: 'active',
      avatar: 'MJ',
      joinedDate: '2023-05-10',
      lastActive: '1 day ago'
    },
    {
      id: '4',
      name: 'Alice Chen',
      email: 'alice@company.com',
      role: 'Moderator',
      status: 'active',
      avatar: 'AC',
      joinedDate: '2023-04-05',
      lastActive: '5 minutes ago'
    },
    {
      id: '5',
      name: 'Bob Williams',
      email: 'bob@company.com',
      role: 'Member',
      status: 'inactive',
      avatar: 'BW',
      joinedDate: '2023-06-18',
      lastActive: '1 week ago'
    },
    {
      id: '6',
      name: 'Emma Davis',
      email: 'emma@company.com',
      role: 'Member',
      status: 'active',
      avatar: 'ED',
      joinedDate: '2023-07-22',
      lastActive: '3 hours ago'
    }
  ];
}
