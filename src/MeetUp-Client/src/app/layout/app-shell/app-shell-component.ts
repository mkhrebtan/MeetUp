import {Component, inject} from '@angular/core';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {RouterOutlet} from '@angular/router';
import {Store} from '@ngrx/store';
import * as WorkspaceSelectors from '../../features/workspace/store/workspace.selectors';
import {AsyncPipe} from '@angular/common';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html',
  imports: [
    SidebarComponent,
    RouterOutlet,
    AsyncPipe,
    ProgressSpinner
  ]
})
export class AppShellComponent {
  private store = inject(Store);
  loading$ = this.store.select(WorkspaceSelectors.selectWorkspaceLoading);
  error$ = this.store.select(WorkspaceSelectors.selectWorkspaceError);
  activeWorkspaceId$ = this.store.select(WorkspaceSelectors.selectActiveWorkspaceId);
}
