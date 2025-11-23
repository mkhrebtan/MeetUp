import {Component} from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    Button,
    Card,
    InputText,
    Password,
    RouterLink
  ]
})
export class RegisterComponent {

}
