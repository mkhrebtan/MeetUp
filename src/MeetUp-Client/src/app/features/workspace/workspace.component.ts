import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Store } from '@ngrx/store';
import { AuthSelectors } from '../auth/store/auth.selectors';
import { AuthActions } from '../auth/store/auth.actions';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkspaceActions } from './store/workspace.actions';
import * as WorkspaceSelectors from './store/workspace.selectors';
import { AsyncPipe } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, InputText, ReactiveFormsModule, AsyncPipe, ProgressSpinner, RouterOutlet],
})
export class WorkspaceComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  user$ = this.store.select(AuthSelectors.selectUser);
  loadingWorkspace$ = this.store.select(WorkspaceSelectors.selectWorkspaceLoading);
  workspace$ = this.store.select(WorkspaceSelectors.selectActiveWorkspaceId);
  loadingCreate$ = this.store.select(WorkspaceSelectors.selectWorkspaceLoadingCreate);
  loadingJoin$ = this.store.select(WorkspaceSelectors.selectWorkspaceLoadingJoin);
  errorCreate$ = this.store.select(WorkspaceSelectors.selectWorkspaceErrorCreate);
  errorJoin$ = this.store.select(WorkspaceSelectors.selectWorkspaceErrorJoin);
  createWorkspaceForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
  });

  joinWorkspaceForm = this.fb.group({
    inviteCode: [
      '',
      [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern(/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/),
      ],
    ],
  });

  ngOnInit() {
    this.user$.subscribe((user) => {
      if (user?.activeWorkspaceId) {
        this.store.dispatch(WorkspaceActions.loadWorkspace({ id: user.activeWorkspaceId }));
      }
    });
  }

  logOut() {
    this.store.dispatch(AuthActions.logout());
  }

  onCreateWorkspaceSubmit() {
    if (this.createWorkspaceForm.valid) {
      this.store.dispatch(
        WorkspaceActions.createWorkspace({ name: this.createWorkspaceForm.value.name! }),
      );
    }
  }

  onJoinWorkspaceSubmit() {
    if (this.joinWorkspaceForm.valid) {
      this.store.dispatch(
        WorkspaceActions.joinWorkspace({ inviteCode: this.joinWorkspaceForm.value.inviteCode! }),
      );
    }
  }
}
