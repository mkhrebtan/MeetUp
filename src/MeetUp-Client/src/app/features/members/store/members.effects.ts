import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MembersService } from '../services/members.service';
import { MembersActions } from './members.actions';
import { catchError, concatMap, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoggerService } from '../../../core/services/logger.service';
import { Store } from '@ngrx/store';
import { selectActiveWorkspaceId } from '../../workspace/store/workspace.selectors';
import { MessageService } from 'primeng/api';

@Injectable()
export class MembersEffects {
  private actions$ = inject(Actions);
  private membersService = inject(MembersService);
  private logger = inject(LoggerService);
  private store = inject(Store);
  private messageService = inject(MessageService);

  loadMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.loadMembers),
      switchMap(({ workspaceId, page, pageSize, search }) =>
        this.membersService.getMembers(workspaceId, page, pageSize, search).pipe(
          map((pagedList) => MembersActions.loadMembersSuccess({ pagedList })),
          catchError((error) => {
            this.logger.error('Load members error:', error);
            return of(
              MembersActions.loadMembersFailure({
                error: error.error.detail || 'Unable to load members. Please try again.',
              }),
            );
          }),
        ),
      ),
    ),
  );

  inviteMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.inviteMembers),
      switchMap(({ workspaceId, emails }) =>
        this.membersService.inviteMembers(workspaceId, emails).pipe(
          map(() => {
            return MembersActions.inviteMembersSuccess();
          }),
          catchError((error) => {
            this.logger.error('Invite members error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.detail || 'Unable to invite members. Please try again.',
            });
            return of(
              MembersActions.inviteMembersFailure({
                error: error.error.detail || 'Unable to invite members. Please try again.',
              }),
            );
          }),
        ),
      ),
    ),
  );

  inviteMembersSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.inviteMembersSuccess),
      tap(() =>
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Members invited successfully.',
        }),
      ),
      withLatestFrom(this.store.select(selectActiveWorkspaceId)),
      concatMap(([, workspaceId]) => {
        if (!workspaceId) {
          return of(
            MembersActions.loadMembersFailure({
              error: 'Unable to reload members, workspace not found.',
            }),
          );
        }

        return of(MembersActions.loadMembers({ workspaceId }));
      }),
    ),
  );

  removeMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.removeMember),
      switchMap(({ workspaceId, email }) =>
        this.membersService.removeMember(workspaceId, email).pipe(
          map(() => MembersActions.removeMemberSuccess()),
          catchError((error) => {
            this.logger.error('Remove member error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.detail || 'Unable to remove member. Please try again.',
            });
            return of(
              MembersActions.removeMemberFailure({
                error: error.error.detail || 'Unable to remove member. Please try again.',
              }),
            );
          }),
        ),
      ),
    ),
  );

  removeMemberSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.removeMemberSuccess),
      tap(() =>
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Member removed successfully.',
        }),
      ),
      withLatestFrom(this.store.select(selectActiveWorkspaceId)),
      concatMap(([, workspaceId]) => {
        if (!workspaceId) {
          return of(
            MembersActions.loadMembersFailure({
              error: 'Unable to reload members, workspace not found.',
            }),
          );
        }

        return of(MembersActions.loadMembers({ workspaceId }));
      }),
    ),
  );

  updateMemberRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.updateMemberRole),
      switchMap(({ userId, role }) =>
        this.membersService.updateMemberRole(userId, role).pipe(
          map(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Member role updated successfully.',
            });
            return MembersActions.updateMemberRoleSuccess({ userId, role });
          }),
          catchError((error) => {
            this.logger.error('Update member role error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.detail || 'Unable to update member role. Please try again.',
            });
            return of(
              MembersActions.updateMemberRoleFailure({
                error: error.error.detail || 'Unable to update member role. Please try again.',
              }),
            );
          }),
        ),
      ),
    ),
  );
}
