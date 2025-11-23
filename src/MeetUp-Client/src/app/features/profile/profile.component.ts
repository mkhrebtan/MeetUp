import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Card,
    Button,
    InputText,
    Password
  ]
})
export class ProfileComponent {
}
