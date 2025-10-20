import { Routes } from '@angular/router';
import { LayoutPublicoComponent } from './layouts/public/layout-publico.component';
import { RegistroClientes } from './pages/homePage/registro-clientes/registro-clientes';
import { Login } from './pages/homePage/login/login';
import { About } from './pages/homePage/about/about';
import { Home } from './pages/homePage/home/home';
import { AuthGuard } from './interceptors/auth.guard';
import { HomeCliente } from './pages/cliente/home/home';
import { HabeasData } from './pages/homePage/habeas-data/habeas-data';
import { Condiciones } from './pages/homePage/condiciones/condiciones';

export const routes: Routes = [
  {
    path: '',
    component: LayoutPublicoComponent,
    children: [
      { path: '', component: Home },
      { path: 'about', component: About },
      { path: 'habeas-data', component: HabeasData },
      { path: 'condiciones', component: Condiciones },
    ],
  },

  { path: 'registroClientes', component: RegistroClientes },
  { path: 'login', component: Login },

  {
    path: 'cliente',
    canActivate: [AuthGuard],
    component: HomeCliente,
    children: [
      {
        path: '',
        redirectTo: 'productos', // Redirección automática
        pathMatch: 'full',
      },
      {
        path: 'productos',
        loadComponent: () => import('./pages/cliente/productos/productos').then((m) => m.Productos),
      },
    ],
  },
];
