import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Card } from 'primeng/card';
import { Badge } from 'primeng/badge';
import { Store } from '@ngrx/store';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { BehaviorSubject, combineLatest, take } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, startWith } from 'rxjs/operators';
import {
  selectMembers,
  selectMembersError,
  selectMembersLoading,
  selectMembersTotalCount,
} from './store/members.selectors';
import {
  selectActiveWorkspaceId,
  selectActiveWorkspaceInviteCode,
} from '../workspace/store/workspace.selectors';
import { MembersActions } from './store/members.actions';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthSelectors } from '../auth/store/auth.selectors';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
    Badge,
    AsyncPipe,
    DatePipe,
    PaginatorModule,
    ReactiveFormsModule,
    DialogModule,
    ChipModule,
    DividerModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }
  `,
})
export class MembersComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  members$ = this.store.select(selectMembers);
  loading$ = this.store.select(selectMembersLoading);
  error$ = this.store.select(selectMembersError);
  workspaceId$ = this.store.select(selectActiveWorkspaceId);
  totalCount$ = this.store.select(selectMembersTotalCount);
  inviteCode$ = this.store.select(selectActiveWorkspaceInviteCode);
  userRole = signal<string | undefined>(undefined);

  searchControl = new FormControl('');

  // Pagination state
  first = signal(0);
  rows = signal(10);
  private paginationState$ = new BehaviorSubject<{ first: number; rows: number }>({
    first: this.first(),
    rows: this.rows(),
  });

  emailInputControl = new FormControl('', [Validators.email, Validators.required]);
  emailsToInvite = signal<string[]>([]);
  isCopied = signal(false);

  ngOnInit(): void {
    this.store
      .select(AuthSelectors.selectUserRole)
      .pipe(take(1))
      .subscribe((role) => this.userRole.set(role));

    const search$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
    );

    combineLatest([
      this.workspaceId$.pipe(filter((id): id is string => !!id)),
      this.paginationState$,
      search$,
    ]).subscribe(([workspaceId, pagination, search]) => {
      const page = Math.floor(pagination.first / pagination.rows) + 1;
      this.store.dispatch(
        MembersActions.loadMembers({
          workspaceId,
          page,
          pageSize: pagination.rows,
          search: search || undefined,
        }),
      );
    });
  }

  onPageChange(event: PaginatorState) {
    this.first.set(event.first || 0);
    this.rows.set(event.rows || 10);
    this.paginationState$.next({ first: this.first(), rows: this.rows() });
  }

  visible = signal(false);

  showDialog() {
    this.visible.set(true);
    // Reset the form when the dialog is opened
    this.emailInputControl.reset();
    this.emailsToInvite.set([]);
    this.isCopied.set(false);
  }

  addEmailToInviteList() {
    const email = this.emailInputControl.value?.trim();
    if (!this.emailInputControl.valid || !email) {
      return;
    }

    if (this.emailsToInvite().includes(email)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Duplicate Email',
        detail: 'This email has already been added to the invite list.',
      });
      return;
    }

    this.members$.pipe(take(1)).subscribe((members) => {
      if (members.some((member) => member.email === email)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Existing Member',
          detail: 'This user is already a member of the workspace.',
        });
      } else {
        this.emailsToInvite.update((emails) => [...emails, email]);
        this.emailInputControl.reset();
      }
    });
  }

  removeEmailFromInviteList(email: string) {
    this.emailsToInvite.update((emails) => emails.filter((e) => e !== email));
  }

  onInvite() {
    this.workspaceId$.pipe(take(1)).subscribe((workspaceId) => {
      const emails = this.emailsToInvite();
      if (!workspaceId || emails.length === 0) {
        return;
      }

      this.store.dispatch(MembersActions.inviteMembers({ workspaceId, emails }));
      this.emailsToInvite.set([]);
      this.emailInputControl.reset();
      this.visible.set(false);
    });
  }

  copyInviteCode() {
    this.inviteCode$.pipe(take(1)).subscribe((code) => {
      if (code) {
        navigator.clipboard.writeText(code);
        this.isCopied.set(true);
        setTimeout(() => {
          this.isCopied.set(false);
        }, 2000);
      }
    });
  }

  onRemoveMember(email: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this member?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.workspaceId$.pipe(take(1)).subscribe((workspaceId) => {
          if (workspaceId) {
            this.store.dispatch(MembersActions.removeMember({ workspaceId, email }));
          }
        });
      },
    });
  }
}
