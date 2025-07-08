import {Component, effect, inject} from '@angular/core';
import {Search} from './actions/search/search';
import {Save} from './actions/save/save';
import {View} from './actions/view/view';
import {Delete} from './actions/delete/delete';
import {Reset} from './actions/reset/reset';
import {Exit} from './actions/exit/exit';
import {Update} from './actions/update/update';
import {NgIf} from '@angular/common';
import {ButtonActions} from '../../../../shared/constant/button-actions';

@Component({
  selector: 'app-navbar',
  imports: [
    Search,
    Save,
    View,
    Delete,
    Reset,
    Exit,
    Update,
    NgIf
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  buttons = ButtonActions;

  constructor() {
    effect(() => {
      console.log('Navbar actions:', this.buttons());
    });
  }
}
