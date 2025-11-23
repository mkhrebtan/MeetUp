import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {RouterLink} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AuthActions} from '../../store/auth.actions';
import {AuthSelectors} from '../../store/auth.selectors';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    Button,
    Card,
    InputText,
    Password,
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
  ]
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading$ = this.store.select(AuthSelectors.selectLoading);
  error$ = this.store.select(AuthSelectors.selectError);

  register(): void {
    if (this.registerForm.valid) {
      this.store.dispatch(AuthActions.register({userData: this.registerForm.value as any}));
    }
  }
}

