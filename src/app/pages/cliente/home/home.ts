import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoutService } from '../../../services/logout.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeCliente {
  isVisible = false; // EN/ES: Controls sidebar visibility / Controla la visibilidad del sidebar
  subMenuOpen: { [key: string]: boolean } = {}; // EN/ES: Track opened submenus / Rastrea submenús abiertos

  constructor(private logoutService: LogoutService) {}

  // EN/ES: Menu items with icons / Ítems del menú con íconos
  menuItems = [
    {
      nombre: 'Perfil Usuario',
      ruta: '/cliente/perfil-usuario',
      icono: 'fas fa-user',
    },
    {
      nombre: 'Carrito Compra',
      ruta: '/cliente/carrito-compra',
      icono: 'fas fa-shopping-cart',
    },
    {
      nombre: 'Productos',
      icono: 'fas fa-boxes',
      subOpciones: [
        { nombre: 'Ver Productos', ruta: '/cliente/productos' },
        { nombre: 'Ofertas Especiales', ruta: '/cliente/ofertas' },
      ],
    },
  ];

  // EN/ES: Show sidebar when hovering left on desktop / Muestra el sidebar al pasar el ratón por la izquierda (en escritorio)
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (window.innerWidth > 768) {
      this.isVisible = event.clientX < 50;
    }
  }

  // EN/ES: Toggle submenu visibility / Alternar visibilidad de submenú
  toggleSubMenu(nombre: string) {
    this.subMenuOpen[nombre] = !this.subMenuOpen[nombre];
  }

  // EN/ES: Toggle sidebar on mobile / Mostrar u ocultar sidebar en móvil
  toggleSidebar() {
    this.isVisible = !this.isVisible;
  }

  // EN/ES: Close sidebar when clicking outside (mobile) / Cerrar sidebar al tocar fuera (en móvil)
  closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
      this.isVisible = false;
    }
  }

  // EN/ES: Logout user / Cerrar sesión del usuario
  salir() {
    this.logoutService.logout();
  }
}
