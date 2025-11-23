import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Store} from '@ngrx/store';
import {AuthActions} from './features/auth/store/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet/>
  `,
  styles: [],
})
export class App {
  private store = inject(Store);

  ngOnInit() {
    this.store.dispatch(AuthActions.init());
  }
}
