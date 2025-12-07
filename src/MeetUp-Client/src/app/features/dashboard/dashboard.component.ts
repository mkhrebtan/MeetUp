import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import * as dashboardSelectors from './store/dashboard.selectors';
import { DashboardActions } from './store/dashboard.actions';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { AsyncPipe } from '@angular/common';
import { UpcomingMeetingItemComponent } from './components/upcoming-meeting-item/upcoming-meeting-item.component';
import { UpcomingMeetingSkeletonComponent } from './components/upcoming-meeting-skeleton/upcoming-meeting-skeleton.component';
import { RouterLink } from '@angular/router';
import { selectWorkspaceMeetingsCreationPolicy } from '../workspace/store/workspace.selectors';
import { AuthSelectors } from '../auth/store/auth.selectors';
import { RecentRecordItemComponent } from './components/recent-record-item/recent-record-item.component';
import { RecentRecordSkeletonComponent } from './components/recent-record-skeleton/recent-record-skeleton.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Button,
    Card,
    KpiCardComponent,
    AsyncPipe,
    UpcomingMeetingItemComponent,
    UpcomingMeetingSkeletonComponent,
    RouterLink,
    RecentRecordItemComponent,
    RecentRecordSkeletonComponent,
  ],
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);

  stats$ = this.store.select(dashboardSelectors.selectKpis);

  statsIcons = ['pi pi-calendar', 'pi pi-clock', 'pi pi-users'];
  statsLoading$ = this.store.select(dashboardSelectors.selectKpisLoading);
  meetings$ = this.store.select(dashboardSelectors.selectMeetings);
  meetingsLoading$ = this.store.select(dashboardSelectors.selectMeetingsLoading);
  error$ = this.store.select(dashboardSelectors.selectError);

  meetingsCreationPolicy = this.store.selectSignal(selectWorkspaceMeetingsCreationPolicy);
  userRole = this.store.selectSignal(AuthSelectors.selectUserRole);
  user$ = this.store.select(AuthSelectors.selectUser);

  canCreateMeeting = computed(() => {
    const policy = this.meetingsCreationPolicy();
    const role = this.userRole();

    if (!policy) return false;

    if (policy === 'ALL_MEMBERS') return true;
    if (policy === 'ONLY_ADMINS' && role === 'Admin') return true;

    return false;
  });

  ngOnInit() {
    this.store.dispatch(DashboardActions.loadKpis());
    this.store.dispatch(DashboardActions.loadMeetings());
    this.store.dispatch(DashboardActions.loadRecords());
  }

  upcomingMeetings$ = this.store.select(dashboardSelectors.selectMeetings);

  recentRecordings$ = this.store.select(dashboardSelectors.selectRecords);

  recordingsLoading$ = this.store.select(dashboardSelectors.selectRecordsLoading);
}
