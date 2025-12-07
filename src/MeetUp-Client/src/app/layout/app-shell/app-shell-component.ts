import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as WorkspaceSelectors from '../../features/workspace/store/workspace.selectors';
import { WorkspaceActions } from '../../features/workspace/store/workspace.actions';
import { AsyncPipe } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html',
  imports: [SidebarComponent, RouterOutlet, AsyncPipe, ProgressSpinner],
})
export class AppShellComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  loading$ = this.store.select(WorkspaceSelectors.selectWorkspaceLoading);
  error$ = this.store.select(WorkspaceSelectors.selectWorkspaceError);
  activeWorkspaceId$ = this.store.select(WorkspaceSelectors.selectActiveWorkspaceId);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const workspaceId = params.get('workspaceId');
      if (workspaceId) {
        this.store.dispatch(WorkspaceActions.loadWorkspace({ id: workspaceId }));
      }
    });
  }
}
