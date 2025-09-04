import { Routes } from '@angular/router';
import { LayoutPublicoComponent } from './layouts/public/layout-publico.component';
import { About } from './pages/homePage/about/about';
import { Home } from './pages/homePage/home/home';

export const routes: Routes = [
  {
    path: '',
    component: LayoutPublicoComponent,
    children: [
      { path: '', component: Home },
      { path: 'about', component: About },
    ],
  },
];
