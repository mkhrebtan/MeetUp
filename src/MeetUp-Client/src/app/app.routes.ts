import { Routes } from '@angular/router';
import { MeetingRoomComponent } from './components/meeting-room/meeting-room.component';
import { JoinRoomComponent } from './components/join-room/join-room.component';

export const routes: Routes = [
  { path: '', component: JoinRoomComponent },
  { path: 'room/:roomName', component: MeetingRoomComponent },
];
