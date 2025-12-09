import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Store } from '@ngrx/store';
import { AuthSelectors } from '../auth/store/auth.selectors';
import { ProfileActions } from './store/profile.actions';
import * as ProfileSelectors from './store/profile.selectors';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, Location, NgOptimizedImage } from '@angular/common';
import { Actions, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { StorageService } from '../../core/services/storage.service';
import { catchError, firstValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Button, InputText, ReactiveFormsModule, AsyncPipe, NgOptimizedImage],
})
export class ProfileComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(NonNullableFormBuilder);
  private actions$ = inject(Actions);
  private messageService = inject(MessageService);
  private storageService = inject(StorageService);
  private location = inject(Location);

  user$ = this.store.select(AuthSelectors.selectUser);
  loading$ = this.store.select(ProfileSelectors.selectLoading);
  error$ = this.store.select(ProfileSelectors.selectError);

  profileChanged = signal(false);
  avatarPreview = signal<string | null>(null);
  selectedAvatarFile = signal<File | null>(null);
  avatarChanged = signal(false);

  profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  initialProfileFormValue!: ReturnType<typeof this.profileForm.getRawValue>;
  initialAvatarUrl: string | null = null;

  private allowedFileTypes = ['image/jpeg', 'image/png'];
  private maxFileSize = 5 * 1024 * 1024;

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.user$.subscribe((user) => {
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
        this.initialProfileFormValue = this.profileForm.getRawValue();
        // Set avatar preview from user data if available
        if (user.avatarUrl) {
          this.avatarPreview.set(user.avatarUrl);
          this.initialAvatarUrl = user.avatarUrl;
        }
      }
    });

    this.profileForm.valueChanges.subscribe(() => {
      this.updateChangedState();
    });

    this.actions$.pipe(ofType(ProfileActions.updateProfileSuccess)).subscribe(() => {
      this.initialProfileFormValue = this.profileForm.getRawValue();
      this.selectedAvatarFile.set(null);
      this.avatarChanged.set(false);
      this.profileChanged.set(false);
    });
  }

  private updateChangedState() {
    const formChanged =
      JSON.stringify(this.profileForm.getRawValue()) !==
      JSON.stringify(this.initialProfileFormValue);
    this.profileChanged.set(formChanged || this.avatarChanged());
  }

  async onSubmit() {
    if (this.profileForm.valid && this.profileChanged()) {
      let avatarUrl: string | undefined = undefined;

      // If there's a new avatar file, upload it to S3 first
      if (this.selectedAvatarFile()) {
        try {
          const file = this.selectedAvatarFile()!;
          const fileName = file.name;

          // Get presigned URL
          const { url: presignedUrl } = await firstValueFrom(
            this.storageService.getFileUploadUrl(fileName, file.type).pipe(
              catchError((error) => {
                console.error('Failed to get presigned URL:', error);
                return of({ url: '' });
              }),
            ),
          );

          // Upload file to S3
          await firstValueFrom(this.storageService.uploadFile(presignedUrl, file));

          // Extract the base URL (without query parameters)
          avatarUrl = presignedUrl.split('?')[0];
        } catch {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload avatar. Please try again.',
          });
          return;
        }
      } else if (this.avatarPreview() === null && this.initialAvatarUrl !== null) {
        // Avatar was removed
        avatarUrl = '';
      }

      // Dispatch update action with avatar URL if it changed
      this.store.dispatch(
        ProfileActions.updateProfile({
          user: {
            ...this.profileForm.getRawValue(),
            ...(avatarUrl !== undefined && { avatarUrl }),
          },
        }),
      );
    }
  }

  onCancel() {
    this.profileForm.reset(this.initialProfileFormValue);
    this.selectedAvatarFile.set(null);
    this.avatarPreview.set(this.initialAvatarUrl);
    this.avatarChanged.set(false);
    this.profileChanged.set(false);
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (!this.allowedFileTypes.includes(file.type)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid file type. Only JPEG and PNG are allowed.',
        });
        return;
      }
      if (file.size > this.maxFileSize) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'File size exceeds the limit of 5MB.',
        });
        return;
      }

      // Store the file for later upload
      this.selectedAvatarFile.set(file);
      this.avatarChanged.set(true);
      this.updateChangedState();

      // Create a preview URL for the selected file
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onRemoveAvatar() {
    this.avatarPreview.set(null);
    this.selectedAvatarFile.set(null);
    this.avatarChanged.set(this.initialAvatarUrl !== null);
    this.updateChangedState();
  }

  triggerFileInput() {
    const fileInput = document.getElementById('avatarInput') as HTMLInputElement;
    fileInput?.click();
  }
}
