import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {Card} from 'primeng/card';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {DatePicker} from 'primeng/datepicker';
import {InputNumber} from 'primeng/inputnumber';
import {Textarea} from 'primeng/textarea';

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
    Textarea
  ]
})
export class CreateMeetingComponent {
  private formBuilder = inject(FormBuilder);
  meetingForm = this.formBuilder.group({
    title: [''],
    date: [''],
    time: [''],
    duration: [''],
    participants: [''],
    description: [''],
  });
}
