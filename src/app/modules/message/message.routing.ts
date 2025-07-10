import {Routes} from '@angular/router';
import {Dashboard} from './feature/dashboard/dashboard';
import {QuickForm} from './feature/quick-form/quick-form';

export const messageRouting: Routes = [
  {path: 'dashboard', component: Dashboard},
  {path: 'quick-form', component: QuickForm},
];
