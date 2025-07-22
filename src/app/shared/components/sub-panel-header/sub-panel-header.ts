import {Component, input} from '@angular/core';

@Component({
  selector: 'app-sub-panel-header',
  imports: [],
  templateUrl: './sub-panel-header.html',
  styleUrl: './sub-panel-header.scss'
})
export class SubPanelHeader {
  subPanelTitle = input<string>();
}
