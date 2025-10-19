import { Routes } from '@angular/router';
import { LayoutPublicoComponent } from './layouts/public/layout-publico.component';
import { RegistroClientes } from './pages/homePage/registro-clientes/registro-clientes';
import { Login } from './pages/homePage/login/login';
import { About } from './pages/homePage/about/about';
import { Home } from './pages/homePage/home/home';
import { AuthGuard } from './interceptors/auth.guard';
import { HomeAuxiliar } from './pages/auxiliarBodega/home/home';
import { HomeGestorBodega } from './pages/gestoBodega/home/home';
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
    path: 'auxiliar-bodega',
    canActivate: [AuthGuard],
    component: HomeAuxiliar,
    children: [
      {
        path: '',
        redirectTo: 'producto/verProductos', // Redirección automática
        pathMatch: 'full',
      },
      {
        path: 'producto/registrar',
        loadComponent: () =>
          import(
            './pages/auxiliarBodega/productos/registrar-productos-auxiliar/registrar-productos-auxiliar'
          ).then((m) => m.RegistrarProductosAuxiliar),
      },
      {
        path: 'producto/verProductos',
        loadComponent: () =>
          import('./pages/auxiliarBodega/productos/ver-productos/ver-productos').then(
            (m) => m.VerProductos
          ),
      },
    ],
  },
  {
    path: 'gestor-bodega',
    canActivate: [AuthGuard],
    component: HomeGestorBodega,
    children: [
      {
        path: '',
        redirectTo: 'producto/verProductos', // Redirección automática
        pathMatch: 'full',
      },
      {
        path: 'producto/verProductos',
        loadComponent: () =>
          import('./pages/gestoBodega/productos-gestor/productos-gestor').then(
            (m) => m.ProductosGestor
          ),
      },
    ],
  },
];
