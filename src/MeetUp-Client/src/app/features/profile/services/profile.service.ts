import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { UpdateUser } from '../models/update-user.model';
import { User } from '../../auth/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiService = inject(ApiService);

  updateProfile(user: UpdateUser) {
    return this.apiService.patch<User>('users', user);
  }
}
