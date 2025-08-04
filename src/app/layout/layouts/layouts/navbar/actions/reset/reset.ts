import { Component } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {RESET_CLICK} from '../../../../../../shared/constant/button-click.constant';

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
    RESET_CLICK.set(true);
  }
}
