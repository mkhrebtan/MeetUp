import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { Store } from '@ngrx/store';
import * as workspaceSelectors from '../workspace/store/workspace.selectors';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsActions } from './store/settings.actions';
import { WorkspaceActions } from '../workspace/store/workspace.actions';
import { AuthSelectors } from '../auth/store/auth.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, InputText, Select, Button, ReactiveFormsModule, AsyncPipe],
})
export class SettingsComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(NonNullableFormBuilder);
  id$ = this.store.select(workspaceSelectors.selectActiveWorkspaceId);
  name$ = this.store.select(workspaceSelectors.selectWorkspaceName);
  invitationPolicy$ = this.store.select(workspaceSelectors.selectWorkspaceInvitationPolicy);
  meetingsCreationPolicy$ = this.store.select(
    workspaceSelectors.selectWorkspaceMeetingsCreationPolicy,
  );
  userRole$ = this.store.select(AuthSelectors.selectUserRole);
  settingsChanged = signal(false);

  invitationPolicyOptions = [
    { label: 'Only admins', value: 'ONLY_ADMINS' },
    { label: 'All members', value: 'ALL_MEMBERS' },
  ];

  meetingsCreationPolicyOptions = [
    { label: 'Only admins', value: 'ONLY_ADMINS' },
    { label: 'All members', value: 'ALL_MEMBERS' },
  ];

  settingsForm = this.fb.group({
    workspaceId: [''],
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    invitationPolicy: ['', [Validators.required]],
    meetingsCreationPolicy: ['', [Validators.required]],
  });

  initialSettingsFormValue!: ReturnType<typeof this.settingsForm.getRawValue>;

  ngOnInit(): void {
    this.id$.subscribe((id) => this.settingsForm.patchValue({ workspaceId: id }));
    this.name$.subscribe((name) => this.settingsForm.patchValue({ name }));
    this.invitationPolicy$.subscribe((policy) =>
      this.settingsForm.patchValue({ invitationPolicy: policy }),
    );
    this.meetingsCreationPolicy$.subscribe((policy) =>
      this.settingsForm.patchValue({ meetingsCreationPolicy: policy }),
    );
    this.initialSettingsFormValue = this.settingsForm.getRawValue();
    this.settingsForm.valueChanges.subscribe(() => {
      this.settingsChanged.set(
        JSON.stringify(this.settingsForm.getRawValue()) !==
          JSON.stringify(this.initialSettingsFormValue),
      );
    });
  }

  onSubmit() {
    if (this.settingsForm.valid && this.settingsChanged()) {
      this.store.dispatch(
        SettingsActions.updateSettings({
          settings: this.settingsForm.getRawValue(),
        }),
      );
    }
  }

  onCancel() {
    this.settingsForm.reset(this.initialSettingsFormValue);
    this.settingsChanged.set(false);
  }

  onLeave() {
    const id = this.settingsForm.getRawValue().workspaceId;
    if (id) {
      this.store.dispatch(WorkspaceActions.leaveWorkspace({ id }));
    }
  }

  onDelete() {
    const id = this.settingsForm.getRawValue().workspaceId;
    if (id) {
      this.store.dispatch(WorkspaceActions.deleteWorkspace({ id }));
    }
  }
}
