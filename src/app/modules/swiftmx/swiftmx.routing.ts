import {Routes} from '@angular/router';
import {Pacs008} from './feature/pacs-008/pacs-008';
import {Pacs009} from './feature/pacs-009/pacs-009';
import {Pacs002} from './feature/pacs-002/pacs-002';
import { Pacs003 } from './feature/pacs-003/pacs-003';

import {Pacs004} from './feature/pacs-004/pacs-004';
import {Pacs054} from './feature/pacs-054/pacs-054';
import {Pacs055} from './feature/pacs-055/pacs-055';
import {Pacs056} from './feature/pacs-056/pacs-056';
import { Pacs029 } from './feature/pacs-029/pacs-029';
export const SwiftmxRouting: Routes = [
  {path: 'pacs-008', component: Pacs008},
  {path: 'pacs-009', component: Pacs009},
  {path: 'pacs-002', component: Pacs002},
  {path: 'pacs-004', component: Pacs004},
  {path: 'pacs-054', component: Pacs054},
  {path: 'pacs-055', component: Pacs055},
  {path: 'pacs-056', component: Pacs056},
  {path: 'pacs-003', component: Pacs003},
  {path: 'pacs-029', component: Pacs029}
];
