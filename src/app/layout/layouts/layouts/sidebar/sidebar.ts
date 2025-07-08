import {Component} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MenuDrawer} from './drawers/menu-drawer/menu-drawer';
import {CommonModule, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatIcon,
    MenuDrawer,
    TitleCasePipe,
    CommonModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

  drawerOpen = false;
  drawerType: string;

  toggleDrawer(type: string) {
    this.drawerOpen = !this.drawerOpen;
    if (this.drawerOpen) this.drawerType = type;
  }

}
