import {Component, inject} from '@angular/core';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {Password} from 'primeng/password';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AuthActions} from '../../store/auth.actions';
import {AuthSelectors} from '../../store/auth.selectors';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    Card,
    InputText,
    Button,
    RouterLink,
    Password,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
  ],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading$ = this.store.select(AuthSelectors.selectLoading);
  error$ = this.store.select(AuthSelectors.selectError);

  login(): void {
    if (this.loginForm.valid) {
      this.store.dispatch(AuthActions.login({credentials: this.loginForm.value as any}));
    }
  }
}
