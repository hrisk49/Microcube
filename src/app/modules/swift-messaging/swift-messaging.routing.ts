import {Routes} from '@angular/router';
import {Pacs008} from './feature/pacs-008/pacs-008';
import {Pacs002} from './feature/pacs-002/pacs-002';

export const swiftMessagingRouting: Routes = [
  {path: 'pacs-008', component: Pacs008},
  {path: 'pacs-002', component: Pacs002},
];
