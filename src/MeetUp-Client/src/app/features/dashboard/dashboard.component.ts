import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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

  ngOnInit() {
    this.store.dispatch(DashboardActions.loadKpis());
    this.store.dispatch(DashboardActions.loadMeetings());
  }

  upcomingMeetings$ = this.store.select(dashboardSelectors.selectMeetings);

  recentRecords = [
    {
      id: 1,
      title: 'Q4 Planning Session',
      date: 'Dec 18, 2024',
      duration: '1h 23m',
      views: 12,
    },
    {
      id: 2,
      title: 'Marketing Strategy Meeting',
      date: 'Dec 17, 2024',
      duration: '52m',
      views: 8,
    },
    {
      id: 3,
      title: 'Team Retrospective',
      date: 'Dec 15, 2024',
      duration: '1h 5m',
      views: 15,
    },
  ];
}
