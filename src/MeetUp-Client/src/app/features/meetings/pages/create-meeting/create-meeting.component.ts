import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';

import { Store } from '@ngrx/store';
import { MeetingsActions } from '../../store/meetings.actions';
import { selectActiveWorkspaceId } from '../../../workspace/store/workspace.selectors';
import { Validators } from '@angular/forms';
import { CreateMeetingRequest } from '../../models/meeting.model';

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Button,
    RouterLink,
    Card,
    ReactiveFormsModule,
    InputText,
    DatePicker,
    InputNumber,
    Textarea,
    SelectModule,
  ],
})
export class CreateMeetingComponent {
  private formBuilder = inject(FormBuilder);
  private store = inject(Store);

  workspaceId = this.store.selectSignal(selectActiveWorkspaceId);

  chatPolicyOptions = [
    { label: 'Disabled', value: 'DISABLED' },
    { label: 'Enabled', value: 'ENABLED' },
  ];

  screenSharePolicyOptions = [
    { label: 'Host Only', value: 'HOST_ONLY' },
    { label: 'All Participants', value: 'ALL_PARTICIPANTS' },
  ];

  recordingPolicyOptions = [
    { label: 'Host Only', value: 'HOST_ONLY' },
    { label: 'All Participants', value: 'ALL_PARTICIPANTS' },
  ];

  meetingForm = this.formBuilder.group({
    title: ['', Validators.required],
    date: [new Date(), Validators.required],
    time: [new Date(), Validators.required],
    duration: [60, [Validators.required, Validators.min(1)]],
    description: [''],
    chatPolicy: ['ENABLED', Validators.required],
    screenSharePolicy: ['ALL_PARTICIPANTS', Validators.required],
    recordingPolicy: ['HOST_ONLY', Validators.required],
  });

  onSubmit() {
    if (this.meetingForm.invalid) {
      return;
    }

    const {
      title,
      date,
      time,
      duration,
      description,
      chatPolicy,
      screenSharePolicy,
      recordingPolicy,
    } = this.meetingForm.value;
    const workspaceId = this.workspaceId();

    if (
      !workspaceId ||
      !title ||
      !date ||
      !time ||
      !duration ||
      !chatPolicy ||
      !screenSharePolicy ||
      !recordingPolicy
    ) {
      return;
    }

    const scheduledAt = new Date(date);
    scheduledAt.setHours(time.getHours());
    scheduledAt.setMinutes(time.getMinutes());

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    const durationString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

    const request: CreateMeetingRequest = {
      title,
      description: description || undefined,
      scheduledAt: scheduledAt.toISOString(),
      duration: durationString,
      workspaceId,
      screenSharePolicy,
      recordingPolicy,
      chatPolicy,
      participants: [],
    };

    this.store.dispatch(MeetingsActions.createMeeting({ request }));
  }
}
