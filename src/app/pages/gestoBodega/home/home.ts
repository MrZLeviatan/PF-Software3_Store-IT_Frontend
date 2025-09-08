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
export class HomeGestorBodega {
  isVisible = false; // controla si la barra se muestra
  subMenuOpen: { [key: string]: boolean } = {};

  constructor(private logoutService: LogoutService) {}

  menuItems = [
    { nombre: 'Perfil Usuario', ruta: '/perfil-usuario', icono: 'fas fa-user' },
    {
      nombre: 'Productos',
      icono: 'fas fa-boxes',
      subOpciones: [{ nombre: 'Ver Productos', ruta: '/gestor-bodega/producto/verProductos' }],
    },
  ];

  // Desktop hover
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (window.innerWidth > 768) {
      this.isVisible = event.clientX < 50;
    }
  }

  // Toggle submenú
  toggleSubMenu(nombre: string) {
    this.subMenuOpen[nombre] = !this.subMenuOpen[nombre];
  }

  // Toggle sidebar móvil
  toggleSidebar() {
    this.isVisible = !this.isVisible;
  }

  // Cerrar sidebar al tocar contenido móvil
  closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
      this.isVisible = false;
    }
  }

  salir() {
    this.logoutService.logout();
  }
}
