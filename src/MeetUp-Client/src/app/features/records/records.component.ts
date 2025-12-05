import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Store } from '@ngrx/store';
import { RecordingCardComponent } from './components/recording-card/recording-card.component';
import { RecordsActions } from './store/records.actions';
import { recordsFeature } from './store/records.reducer';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconField, InputIcon, InputText, Button, RecordingCardComponent, AsyncPipe],
})
export class RecordsComponent implements OnInit {
  private readonly store = inject(Store);

  recordings$ = this.store.select(recordsFeature.selectRecordings);
  loading$ = this.store.select(recordsFeature.selectLoading);
  error$ = this.store.select(recordsFeature.selectError);

  ngOnInit() {
    this.store.dispatch(RecordsActions.actions.loadRecordings());
  }
}
