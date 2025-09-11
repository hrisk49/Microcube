import {Routes} from '@angular/router';
import { AllComponentsPage } from '../../shared/components/all-components-page/all-components-page';
import {Authorization} from '../../shared/components/authorization/authorization';

export const SwiftmxRouting: Routes = [
  

  {path: 'authorization', component: Authorization},

  {path: 'components', component: AllComponentsPage},
];
