import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoutService } from '../../services/logout.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  isVisible = false; // Controla la visibilidad del sidebar
  subMenuOpen: { [key: string]: boolean } = {}; // Rastrea submenús abiertos
  sidebarSubtitle: string = ''; // Subtítulo bajo el logo
  menuItems: any[] = []; // Opciones del menú

  constructor(private logoutService: LogoutService) {}

  ngOnInit(): void {
    // Se obtiene el rol del usuario
    const rolUsuario = localStorage.getItem('rolUsuario') || 'ROLE_CLIENTE';

    switch (rolUsuario) {
      case 'ROLE_GESTOR_COMERCIAL':
        this.configurarGestorComercial();
        break;

      case 'admin':
        this.configurarAdministrador();
        break;

      case 'auxiliar':
        this.configurarAuxiliar();
        break;

      default:
        this.configurarCliente();
        break;
    }
  }

  /** ==============================
   *  CONFIGURACIÓN DE MENÚS SEGÚN ROL
   *  ============================== */

  private configurarGestorComercial(): void {
    this.sidebarSubtitle = 'Panel Gestor Comercial';
    this.menuItems = [
      { nombre: 'Perfil', ruta: '/gestor/perfil', icono: 'fas fa-user-tie' },
      {
        nombre: 'Clientes',
        icono: 'fas fa-users',
        subOpciones: [
          { nombre: 'Lista Clientes', ruta: '/gestor/clientes' },
          { nombre: 'Registrar Cliente', ruta: '/gestor/registrar-cliente' },
        ],
      },
      {
        nombre: 'Productos',
        icono: 'fas fa-boxes',
        subOpciones: [
          { nombre: 'Ver Productos', ruta: '/gestor-comercial/productos' },
          { nombre: 'Ofertas y Descuentos', ruta: '/gestor/ofertas' },
        ],
      },
    ];
  }

  private configurarAdministrador(): void {
    this.sidebarSubtitle = 'Panel Administrador';
    this.menuItems = [
      { nombre: 'Dashboard', ruta: '/admin/dashboard', icono: 'fas fa-chart-line' },
      { nombre: 'Usuarios', ruta: '/admin/usuarios', icono: 'fas fa-user-shield' },
      { nombre: 'Bodegas', ruta: '/admin/bodegas', icono: 'fas fa-warehouse' },
      { nombre: 'Reportes', ruta: '/admin/reportes', icono: 'fas fa-file-alt' },
    ];
  }

  private configurarAuxiliar(): void {
    this.sidebarSubtitle = 'Panel Auxiliar';
    this.menuItems = [
      { nombre: 'Perfil', ruta: '/auxiliar/perfil', icono: 'fas fa-user' },
      { nombre: 'Inventario', ruta: '/auxiliar/inventario', icono: 'fas fa-cubes' },
      { nombre: 'Movimientos', ruta: '/auxiliar/movimientos', icono: 'fas fa-exchange-alt' },
    ];
  }

  private configurarCliente(): void {
    this.sidebarSubtitle = 'Panel Cliente';
    this.menuItems = [
      { nombre: 'Perfil Usuario', ruta: '/cliente/perfil-usuario', icono: 'fas fa-user' },
      { nombre: 'Carrito Compra', ruta: '/cliente/carrito-compra', icono: 'fas fa-shopping-cart' },
      {
        nombre: 'Productos',
        icono: 'fas fa-boxes',
        subOpciones: [
          { nombre: 'Ver Productos', ruta: '/cliente/productos' },
          { nombre: 'Ofertas Especiales', ruta: '/cliente/ofertas' },
        ],
      },
    ];
  }

  /** ==============================
   *  FUNCIONALIDADES GENERALES
   *  ============================== */

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // Mostrar sidebar al pasar por la izquierda (escritorio)
    if (window.innerWidth > 768) {
      this.isVisible = event.clientX < 50;
    }
  }

  toggleSubMenu(nombre: string) {
    this.subMenuOpen[nombre] = !this.subMenuOpen[nombre];
  }

  toggleSidebar() {
    this.isVisible = !this.isVisible;
  }

  closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
      this.isVisible = false;
    }
  }

  salir() {
    this.logoutService.logout();
  }
}
