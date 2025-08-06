import {Routes} from '@angular/router';
import {Pacs008} from './feature/pacs-008/pacs-008';
import {Pacs009} from './feature/pacs-009/pacs-009';

export const SwiftmxRouting: Routes = [
  {path: 'pacs-008', component: Pacs008},
  {path: 'pacs-009', component: Pacs009},
];
