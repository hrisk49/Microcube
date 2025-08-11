import {Routes} from '@angular/router';
import {Pacs008} from './feature/pacs-008/pacs-008';
import {Pacs009} from './feature/pacs-009/pacs-009';
import {Pacs002} from './feature/pacs-002/pacs-002';

import {Pacs004} from './feature/pacs-004/pacs-004';
import {Pacs054} from './feature/pacs-054/pacs-054';
import {Pacs055} from './feature/pacs-055/pacs-055';
import {Pacs056} from './feature/pacs-056/pacs-056';
import {Pacs105} from "./feature/pacs-105/pacs-105";
import {Pacs106} from "./feature/pacs-106/pacs-106";
import {Pacs109} from "./feature/pacs-109/pacs-109";
import {Pacs003} from './feature/pacs-003/pacs-003';
import {Pacs052} from './feature/pacs-052/pacs-052';
import {Pacs029} from './feature/pacs-029/pacs-029';
import {Pacs053} from './feature/pacs-053/pacs-053';

export const SwiftmxRouting: Routes = [
  {path: 'pacs-002', component: Pacs002},
  {path: 'pacs-003', component: Pacs003},
  {path: 'pacs-004', component: Pacs004},
  {path: 'pacs-008', component: Pacs008},
  {path: 'pacs-009', component: Pacs009},
  {path: 'pacs-029', component: Pacs029},
  {path: 'pacs-052', component: Pacs052},
  {path: 'pacs-053', component: Pacs053},
  {path: 'pacs-054', component: Pacs054},
  {path: 'pacs-055', component: Pacs055},
  {path: 'pacs-056', component: Pacs056},
  {path: 'pacs-105', component: Pacs105},
  {path: 'pacs-106', component: Pacs106},
  {path: 'pacs-109', component: Pacs109},
];
