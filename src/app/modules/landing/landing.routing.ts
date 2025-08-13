import {Routes} from '@angular/router';
import {Dashboard} from './feature/dashboard/dashboard';
import { AlertExamplePage } from './alert-example-page/alert-example-page';
import {Login} from './login/login';

export const landingRouting: Routes = [
  {path: 'login', component: Login},
  {path: 'dashboard', component: Dashboard},
  {path: 'alert-example-page', component: AlertExamplePage}
];
