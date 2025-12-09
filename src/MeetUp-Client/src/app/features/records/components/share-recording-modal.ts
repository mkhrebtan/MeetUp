import { Component, effect, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { recordsFeature } from '../store/records.reducer';
import { RecordsActions } from '../store/records.actions';

@Component({
  selector: 'app-share-recording-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, PickListModule, MessageModule],
  template: `
    <p-dialog
      header="Share Recording"
      [visible]="visible()"
      (visibleChange)="onVisibleChange($event)"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [draggable]="false"
      [resizable]="false"
    >
      @if (error()) {
        <p-message severity="error" [text]="$any(error())" class="block mb-4"></p-message>
      }

      <div class="h-80">
        <p-pickList
          [source]="sourceMembers()"
          [target]="targetMembers()"
          sourceHeader="Available Members"
          targetHeader="Selected Members"
          [dragdrop]="true"
          [responsive]="true"
          [sourceStyle]="{ height: '15rem' }"
          [targetStyle]="{ height: '15rem' }"
          filterBy="fullName"
          sourceFilterPlaceholder="Search by name"
          targetFilterPlaceholder="Search by name"
        >
          <ng-template let-member pTemplate="item">
            <div class="flex items-center gap-2 text-sm p-2">
              @if (member.avatarUrl) {
                <img
                  [src]="member.avatarUrl"
                  [alt]="member.fullName"
                  class="w-8 h-8 rounded-full object-cover"
                />
              } @else {
                <div
                  class="w-8 h-8 rounded-full bg-surface-200 flex items-center justify-center text-xs font-medium"
                >
                  {{ member.fullName.charAt(0) }}
                </div>
              }
              <div class="flex-1">
                <div class="font-medium">{{ member.fullName }}</div>
              </div>
            </div>
          </ng-template>
        </p-pickList>
      </div>

      <ng-template pTemplate="footer">
        <p-button label="Cancel" (onClick)="close()" [text]="true" severity="secondary" />
        <p-button
          label="Share"
          (onClick)="submit()"
          [loading]="loading()"
          [disabled]="targetMembers().length === 0"
        />
      </ng-template>
    </p-dialog>
  `,
  styles: [
    `
      :host ::ng-deep .p-picklist .p-picklist-list {
        height: 100%;
      }
    `,
  ],
})
export class ShareRecordingModal {
  private readonly store = inject(Store);

  visible = this.store.selectSignal(recordsFeature.selectShareModalVisible);
  loading = this.store.selectSignal(recordsFeature.selectShareLoading);
  error = this.store.selectSignal(recordsFeature.selectShareError);
  candidates = this.store.selectSignal(recordsFeature.selectShareCandidates);

  sourceMembers = signal<{ id: string; fullName: string; avatarUrl?: string }[]>([]);
  targetMembers = signal<{ id: string; fullName: string; avatarUrl?: string }[]>([]);

  constructor() {
    effect(() => {
      if (!this.visible()) {
        this.reset();
      }
    });

    effect(() => {
      this.sourceMembers.set([...this.candidates()]);
    });
  }

  submit() {
    if (this.targetMembers().length === 0) return;

    const recipientIds = this.targetMembers().map((m) => m.id);
    this.store.dispatch(RecordsActions.actions.shareRecording({ recipientIds }));
  }

  close() {
    this.store.dispatch(RecordsActions.actions.closeShareModal());
  }

  onHide() {
    this.store.dispatch(RecordsActions.actions.closeShareModal());
  }

  onVisibleChange(visible: boolean) {
    if (!visible) {
      this.close();
    }
  }

  reset() {
    this.targetMembers.set([]);
  }
}
