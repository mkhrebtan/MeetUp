import {Routes} from '@angular/router';
import {MeetingsListComponent} from './components/meetings-list/meetings-list.component';
import {RoomComponent} from './components/room/room.component';

export const routes: Routes = [
  {path: '', component: MeetingsListComponent},
  {path: 'room/:meetingId', component: RoomComponent},
];
