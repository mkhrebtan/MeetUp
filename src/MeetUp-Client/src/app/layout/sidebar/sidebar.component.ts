import {Component, inject, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Button} from 'primeng/button';
import {Store} from '@ngrx/store';
import {AuthSelectors} from '../../features/auth/store/auth.selectors';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [
    RouterLink,
    RouterLinkActive,
    Button,
    AsyncPipe
  ],
  styles: [`
    :host ::ng-deep p-button {
      width: 100%;
      justify-content: flex-start;
    }

    :host ::ng-deep .p-button {
      width: 100%;
      justify-content: flex-start;
      text-align: left;
    }
  `]
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] = [];
  private readonly store = inject(Store);
  user$ = this.store.select(AuthSelectors.selectUser);

  constructor() {
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/dashboard']
      },
      {
        label: 'Meetings',
        icon: 'pi pi-video',
        routerLink: ['/meetings']
      },
      {
        label: 'Records',
        icon: 'pi pi-file',
        routerLink: ['/records']
      },
      {
        label: 'Members',
        icon: 'pi pi-users',
        routerLink: ['/members']
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        routerLink: ['/settings']
      }
    ];
  }
}

