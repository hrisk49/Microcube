import {Component, effect} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {FormGroupSignal, ONCLICK_RESET, ONCLICK_SAVE} from '../../../../../../shared/constant/button-signals.constant';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'app-save',
    imports: [
        MatIcon
    ],
    templateUrl: './save.html',
    standalone: true,
    styleUrl: './save.scss'
})
export class Save {

  frmGroup: FormGroup = FormGroupSignal();

  constructor() {
  }

  save() {
    ONCLICK_SAVE.set(true);
  }
}
