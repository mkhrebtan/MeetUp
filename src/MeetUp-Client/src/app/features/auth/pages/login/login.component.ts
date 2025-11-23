import {Component} from '@angular/core';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {Password} from 'primeng/password';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    Card,
    InputText,
    Button,
    RouterLink,
    Password
  ],
})
export class LoginComponent {

}
