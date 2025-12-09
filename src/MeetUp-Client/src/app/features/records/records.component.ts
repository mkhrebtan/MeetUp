import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { Store } from '@ngrx/store';
import { RecordingCardComponent } from './components/recording-card/recording-card.component';
import { RecordsActions, RecordsFilter } from './store/records.actions';
import { recordsFeature } from './store/records.reducer';
import { Recording } from './services/recordings.service';

import { ShareRecordingModal } from './components/share-recording-modal';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, RecordingCardComponent, AsyncPipe, ShareRecordingModal],
})
export class RecordsComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);

  recordings$ = this.store.select(recordsFeature.selectRecordings);
  loading$ = this.store.select(recordsFeature.selectLoading);
  error$ = this.store.select(recordsFeature.selectError);
  filter$ = this.store.select(recordsFeature.selectFilter);

  shareModalVisible$ = this.store.select(recordsFeature.selectShareModalVisible);

  ngOnInit() {
    this.store.dispatch(RecordsActions.actions.loadRecordings());
    this.store.dispatch(RecordsActions.actions.loadSharedRecordings());
  }

  onPlay(recording: Recording) {
    this.store.dispatch(RecordsActions.actions.getRecordingUrl({ recordingKey: recording.key }));
  }

  onShare(recording: Recording) {
    this.store.dispatch(RecordsActions.actions.openShareModal({ recordingKey: recording.key }));
  }

  setFilter(filter: RecordsFilter) {
    this.store.dispatch(RecordsActions.actions.setFilter({ filter }));
  }

  onDelete(recording: Recording) {
    this.store.dispatch(RecordsActions.actions.deleteRecording({ recordingKey: recording.key }));
  }
}
