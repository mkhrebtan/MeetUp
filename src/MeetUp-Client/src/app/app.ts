import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './features/auth/store/auth.actions';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  template: ` <router-outlet /> <p-toast></p-toast>`,
  styles: [],
})
export class App implements OnInit {
  private store = inject(Store);

  ngOnInit() {
    this.store.dispatch(AuthActions.init());
  }
}
