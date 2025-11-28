import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { MeetingModel } from '../models/meeting.model';
import { KpisModel } from '../models/kpis.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiService = inject(ApiService);

  getMeetings(count: number) {
    return this.apiService.get<MeetingModel[]>('dashboard/upcoming-meetings', {
      count: count,
    });
  }

  getKpis() {
    return this.apiService.get<KpisModel>('dashboard/kpi-stats');
  }
}
