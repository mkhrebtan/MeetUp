import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { MeetingModel } from '../models/meeting.model';
import { KpisModel } from '../models/kpis.model';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiService = inject(ApiService);

  getMeetings(count: number) {
    return this.apiService
      .get<MeetingModel[]>('dashboard/upcoming-meetings', {
        count: count,
      })
      .pipe(delay(1000));
  }

  getKpis() {
    return this.apiService.get<KpisModel>('dashboard/kpi-stats').pipe(delay(1000));
  }
}
