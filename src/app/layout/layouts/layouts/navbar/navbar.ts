import {Component} from '@angular/core';
import {Search} from './actions/search/search';
import {Save} from './actions/save/save';
import {View} from './actions/view/view';
import {Delete} from './actions/delete/delete';
import {Reset} from './actions/reset/reset';
import {Exit} from './actions/exit/exit';
import {Update} from './actions/update/update';
import {SAVE, UPDATE} from '../../../../core/constant/submit-action.constant';

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
  styleUrl: './navbar.scss'
})
export class Navbar {

  protected readonly SAVE = SAVE;
  protected readonly UPDATE = UPDATE;
  submitAction: string = SAVE;
}
