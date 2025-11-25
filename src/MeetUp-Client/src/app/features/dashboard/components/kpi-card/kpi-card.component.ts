import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { KpiStatModel } from '../../models/kpi-stat.model';

@Component({
  selector: 'app-kpi-card',
  imports: [Card, Skeleton],
  templateUrl: './kpi-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  stat = input.required<KpiStatModel>();
  loading = input<boolean>(false);
  icon = input.required<string>();
}
