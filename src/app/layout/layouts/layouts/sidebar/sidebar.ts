import {Component} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MenuDrawer} from './drawers/menu-drawer/menu-drawer';
import {CommonModule, TitleCasePipe} from '@angular/common';
import {ProfileDrawer} from './drawers/profile-drawer/profile-drawer';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatIcon,
    MenuDrawer,
    TitleCasePipe,
    CommonModule,
    ProfileDrawer,
    RouterLink,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

  drawerOpen = false;
  drawerType: string;

  toggleDrawer(type: string) {
    this.drawerOpen = !this.drawerOpen;
    if (this.drawerType !== type) this.drawerOpen = true;
    if (this.drawerOpen) this.drawerType = type;
  }

}
