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
import { Recording } from './services/recordings.service';

import { ShareRecordingModal } from './components/share-recording-modal';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconField,
    InputIcon,
    InputText,
    Button,
    RecordingCardComponent,
    AsyncPipe,
    ShareRecordingModal,
  ],
})
export class RecordsComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);

  recordings$ = this.store.select(recordsFeature.selectRecordings);
  loading$ = this.store.select(recordsFeature.selectLoading);
  error$ = this.store.select(recordsFeature.selectError);

  shareModalVisible$ = this.store.select(recordsFeature.selectShareModalVisible);

  ngOnInit() {
    this.store.dispatch(RecordsActions.actions.loadRecordings());
  }

  onPlay(recording: Recording) {
    this.store.dispatch(RecordsActions.actions.getRecordingUrl({ recordingKey: recording.key }));
  }

  onShare(recording: Recording) {
    this.store.dispatch(RecordsActions.actions.openShareModal({ recordingKey: recording.key }));
  }
}
