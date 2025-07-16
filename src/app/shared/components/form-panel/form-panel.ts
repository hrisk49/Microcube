import {Component, input} from '@angular/core';

@Component({
  selector: 'app-form-panel',
  imports: [],
  templateUrl: './form-panel.html',
  standalone: true,
  styleUrl: './form-panel.scss'
})
export class FormPanel {

  panelTitle =  input<string>('');

}
