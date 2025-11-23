import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {Card} from 'primeng/card';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Dialog} from 'primeng/dialog';
import {DatePicker} from 'primeng/datepicker';
import {InputNumber} from 'primeng/inputnumber';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Button,
    InputText,
    IconField,
    InputIcon,
    Card,
    DatePipe,
    RouterLink,
    Dialog,
    DatePicker,
    InputNumber,
    Textarea
  ]
})
export class MeetingsComponent {
  meetings = [
    {
      id: "1",
      title: "Product Design Review",
      date: "2024-12-22",
      time: "14:00",
      duration: "45 min",
      participants: ["Alice", "Bob", "Charlie", "David", "Eve"],
      status: "upcoming",
      type: "video",
    },
    {
      id: "2",
      title: "Engineering Standup",
      date: "2024-12-22",
      time: "16:30",
      duration: "15 min",
      participants: ["Team A"],
      status: "upcoming",
      type: "video",
    },
    {
      id: "3",
      title: "Q1 Roadmap Planning",
      date: "2024-12-23",
      time: "10:00",
      duration: "90 min",
      participants: ["Leadership Team"],
      status: "scheduled",
      type: "video",
    },
    {
      id: "4",
      title: "Client Sync: Acme Corp",
      date: "2024-12-24",
      time: "11:00",
      duration: "30 min",
      participants: ["Sarah", "Client"],
      status: "scheduled",
      type: "video",
    },
  ];

  isCreateMeetingDialogVisible = signal(false);

  showCreateMeetingDialog() {
    this.isCreateMeetingDialogVisible.set(true);
  }
}
