import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { Tooltip } from 'primeng/tooltip';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Card } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MeetingsActions } from './store/meetings.actions';
import {
  selectHostedMeetings,
  selectInvitedMeetings,
  selectMeetingsLoading,
} from './store/meetings.selectors';
import { selectActiveWorkspaceId } from '../workspace/store/workspace.selectors';
import { Dialog } from 'primeng/dialog';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { selectWorkspaceMeetingsCreationPolicy } from '../workspace/store/workspace.selectors';
import { AuthSelectors } from '../auth/store/auth.selectors';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

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
    Tooltip,
    Dialog,
    ReactiveFormsModule,
  ],
})
export class MeetingsComponent {
  private store = inject(Store);
  private messageService = inject(MessageService);
  private formBuilder = inject(FormBuilder);

  workspaceId = this.store.selectSignal(selectActiveWorkspaceId);
  hostedMeetings = this.store.selectSignal(selectHostedMeetings);
  invitedMeetings = this.store.selectSignal(selectInvitedMeetings);
  loading = this.store.selectSignal(selectMeetingsLoading);
  meetingsCreationPolicy = this.store.selectSignal(selectWorkspaceMeetingsCreationPolicy);
  userRole = this.store.selectSignal(AuthSelectors.selectUserRole);

  searchControl = new FormControl('');
  showPassed = signal(false);

  private search = toSignal(
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged()),
  );

  canCreateMeeting = computed(() => {
    const policy = this.meetingsCreationPolicy();
    const role = this.userRole();

    if (!policy) return false;

    if (policy === 'ALL_MEMBERS') return true;
    if (policy === 'ONLY_ADMINS' && role === 'Admin') return true;

    return false;
  });

  showJoinDialog = signal(false);
  joinMeetingForm = this.formBuilder.group({
    inviteCode: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const workspaceId = this.workspaceId();
      const search = this.search();
      const passed = this.showPassed();

      if (workspaceId) {
        this.store.dispatch(
          MeetingsActions.loadHostedMeetings({
            workspaceId,
            searchTerm: search || undefined,
            passed: passed,
          }),
        );
        this.store.dispatch(
          MeetingsActions.loadInvitedMeetings({
            workspaceId,
            searchTerm: search || undefined,
            passed: passed,
          }),
        );
      }
    });
  }

  toggleShowPassed() {
    this.showPassed.set(!this.showPassed());
  }

  copyInviteCode(event: Event, code: string) {
    event.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copied',
        detail: 'Invite code copied to clipboard',
      });
    });
  }

  deleteMeeting(meetingId: string) {
    const workspaceId = this.workspaceId();
    if (workspaceId) {
      this.store.dispatch(MeetingsActions.deleteMeeting({ meetingId, workspaceId }));
    }
  }

  openJoinDialog() {
    this.showJoinDialog.set(true);
    this.joinMeetingForm.reset();
  }

  closeJoinDialog() {
    this.showJoinDialog.set(false);
    this.joinMeetingForm.reset();
  }

  submitJoinMeeting() {
    if (this.joinMeetingForm.valid) {
      const inviteCode = this.joinMeetingForm.value.inviteCode;
      if (inviteCode) {
        this.store.dispatch(MeetingsActions.joinMeeting({ inviteCode }));
        this.closeJoinDialog();
      }
    }
  }

  leaveMeeting(meetingId: string) {
    const workspaceId = this.workspaceId();
    if (workspaceId) {
      this.store.dispatch(MeetingsActions.leaveMeeting({ meetingId, workspaceId }));
    }
  }
}
