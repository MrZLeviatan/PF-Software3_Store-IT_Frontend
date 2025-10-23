import { CarritoCompra } from './pages/cliente/carrito-compra/carrito-compra';
import { Routes } from '@angular/router';
import { LayoutPublicoComponent } from './layouts/public/layout-publico.component';
import { RegistroClientes } from './pages/homePage/registro-clientes/registro-clientes';
import { Login } from './pages/homePage/login/login';
import { About } from './pages/homePage/about/about';
import { Home } from './pages/homePage/home/home';
import { AuthGuard } from './interceptors/auth.guard';
import { HabeasData } from './pages/homePage/habeas-data/habeas-data';
import { Condiciones } from './pages/homePage/condiciones/condiciones';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [
  {
    // Rutas públicas
    path: '',
    component: LayoutPublicoComponent,
    children: [
      { path: '', component: Home },
      { path: 'about', component: About },
      { path: 'habeas-data', component: HabeasData },
      { path: 'condiciones', component: Condiciones },
    ],
  },

  // Registro y Lógin ( Primer proceso del proyectp )
  { path: 'registroClientes', component: RegistroClientes },
  { path: 'login', component: Login },

  {
    // Rutas privadas - Cliente
    path: 'cliente',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' }, // Redirección automática al cargar la ruta 'cliente'
      {
        path: 'productos',
        loadComponent: () => import('./pages/cliente/productos/productos').then((m) => m.Productos),
      },
      {
        path: 'carrito-compra',
        loadComponent: () =>
          import('./pages/cliente/carrito-compra/carrito-compra').then((m) => m.CarritoCompra),
      },
    ],
  },

  {
    // Rutas privadas - Gestor Comercial
    path: 'gestor-comercial',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' }, // Redirección automática al cargar la ruta 'gestor-comercial'
      {
        path: 'productos',
        loadComponent: () =>
          import('./pages/gestor-comercial/productos/productos').then(
            (m) => m.ProductosGestorComcercial
          ),
      },
      {
        path: 'registro-productos',
        loadComponent: () =>
          import('./pages/gestor-comercial/registro-productos/registro-productos').then(
            (m) => m.RegistroProductos
          ),
      },
    ],
  },
];
