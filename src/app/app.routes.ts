import { Routes } from '@angular/router';
import { LayoutPublicoComponent } from './layouts/public/layout-publico.component';
import { RegistroClientes } from './pages/homePage/registro-clientes/registro-clientes';
import { Login } from './pages/homePage/login/login';
import { About } from './pages/homePage/about/about';
import { Home } from './pages/homePage/home/home';
import { AuthGuard } from './interceptors/auth.guard';
import { HomeAuxiliar } from './pages/auxiliarBodega/home/home';

export const routes: Routes = [
  {
    path: '',
    component: LayoutPublicoComponent,
    children: [
      { path: '', component: Home },
      { path: 'about', component: About },
    ],
  },

  { path: 'registroClientes', component: RegistroClientes },
  { path: 'login', component: Login },

  {
    path: 'auxiliar-bodega',
    canActivate: [AuthGuard],
    component: HomeAuxiliar,
    children: [
      {
        path: 'producto/registrar',
        loadComponent: () =>
          import(
            './pages/auxiliarBodega/productos/registrar-productos-auxiliar/registrar-productos-auxiliar'
          ).then((m) => m.RegistrarProductosAuxiliar),
      },
    ],
  },
];
