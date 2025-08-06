import { Component } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {ONCLICK_RESET} from '../../../../../../shared/constant/button-signals.constant';

@Component({
    selector: 'app-reset',
    imports: [
        MatIcon
    ],
    templateUrl: './reset.html',
    standalone: true,
    styleUrl: './reset.scss'
})
export class Reset {

  reset() {
    ONCLICK_RESET.set(true);
  }
}
