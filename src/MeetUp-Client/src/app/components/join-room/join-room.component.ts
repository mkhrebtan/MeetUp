import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {Button} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-join-room',
  imports: [Button, FormsModule, InputTextModule],
  template: `
    <div class="h-[100vh] !max-h-[100vh] flex flex-col bg-black/90">
      <div class="flex flex-col gap-2 p-4">
        <label for="roomName" class="text-white">Room Name</label>
        <input id="roomName" type="text" pInputText [(ngModel)]="roomName"/>
        <p-button (click)="joinRoom()" label="Join Room"></p-button>
      </div>
    </div>
  `,
  styles: [],
})
export class JoinRoomComponent {
  roomName = signal('');
  private router = inject(Router);

  joinRoom() {
    this.router.navigate(['/room', this.roomName()]);
  }
}
