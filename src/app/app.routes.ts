import {Routes} from '@angular/router';
import {Layout} from './layout/layout';

export const routes: Routes = [

  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: '', component: Layout,
    data: {
      layout: 'empty'
    },
    children: [
      {path: '', loadChildren: () => import('./modules/message/message.routing').then(m => m.messageRouting)},
    ]
  }

];

