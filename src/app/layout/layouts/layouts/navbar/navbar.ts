import {Component, effect} from '@angular/core';
import {Search} from './actions/search/search';
import {Save} from './actions/save/save';
import {View} from './actions/view/view';
import {Delete} from './actions/delete/delete';
import {Reset} from './actions/reset/reset';
import {Exit} from './actions/exit/exit';
import {Update} from './actions/update/update';
import {ButtonActionsConstant} from '../../../../shared/constant/button-actions.constant';

@Component({
  selector: 'app-navbar',
  imports: [
    Search,
    Save,
    View,
    Delete,
    Reset,
    Exit,
    Update
  ],
  templateUrl: './navbar.html',
  standalone: true,
  styleUrl: './navbar.scss'
})
export class Navbar {

  buttons = ButtonActionsConstant;
  toggleMenu: boolean = false;

  constructor() {
    effect(() => {
      console.log('Navbar actions:', this.buttons());
    });
  }
}
