import { createActionGroup, props } from '@ngrx/store';
import { UpdateUser } from '../models/update-user.model';
import { User } from '../../auth/models/user.model';

export const ProfileActions = createActionGroup({
  source: 'Profile',
  events: {
    UpdateProfile: props<{ user: UpdateUser }>(),
    UpdateProfileSuccess: props<{ user: User }>(),
    UpdateProfileFailure: props<{ error: string }>(),
  },
});
