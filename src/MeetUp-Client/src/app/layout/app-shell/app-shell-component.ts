import {Component} from '@angular/core';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html',
  imports: [
    SidebarComponent,
    RouterOutlet
  ]
})
export class AppShellComponent {
}
