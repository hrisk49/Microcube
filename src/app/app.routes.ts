import {Routes} from '@angular/router';
import {Layout} from './layout/layout';

export const routes: Routes = [

  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: '', component: Layout,
    data: {
      layout: 'empty'
    },
    children: [
      {path: '', loadChildren: () => import('./modules/landing/landing.routing').then(m => m.landingRouting)},
    ]
  },
  {
    path: 'mx', component: Layout,
    data: {
      layout: 'empty'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/swiftmx/swiftmx.routing').then(m => m.SwiftmxRouting)
      },
    ]
  },
  // {
  //   path: 'mx', component: Layout,
  //   data: {
  //     layout: 'empty'
  //   },
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./modules/swift-messaging/swift-messaging.routing').then(m => m.swiftMessagingRouting)
  //     },
  //   ]
  // }

];

