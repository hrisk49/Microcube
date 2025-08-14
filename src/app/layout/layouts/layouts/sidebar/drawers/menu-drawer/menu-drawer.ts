import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-menu-drawer',
  imports: [
    RouterLink,
    MatIcon,
  ],
  templateUrl: './menu-drawer.html',
  standalone: true,
  styleUrl: './menu-drawer.scss',
  animations: [
    trigger('expandCollapse', [
      state('open', style({height: '*', opacity: 1})),
      state('closed', style({height: '0px', opacity: 0})),
      transition('open <=> closed', animate('300ms ease-in-out'))
    ])
  ]
})
export class MenuDrawer {

  openSections: { [key: string]: boolean } = {
    mxMessages: false,
    messageList: true,
  };

  toggleSection(section: string): void {
    this.openSections[section] = !this.openSections[section];
  }

  isSectionOpen(section: string): boolean {
    return this.openSections[section];
  }

}
