import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  imports: [CommonModule, RouterModule],
  templateUrl: './top-bar.html',
  standalone: true,
  styleUrl: './top-bar.css',
})
export class TopBar {
  isBrowser: boolean; //  Indica si el código se ejecuta en el navegador
  scrollOpacity: number = 0; // Controla la opacidad del fondo al hacer scroll
  menuOpen: boolean = false; // Indica si el menú móvil está abierto

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, // Inyección del ID de plataforma para verificar si es navegador
    private router: Router // Inyección del router para navegación programática
  ) {
    // Detecta si la plataforma es navegador (evita errores en SSR)
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Alterna el estado del menú desplegable (usado en vista móvil)
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Escucha el evento de scroll para ajustar la opacidad del top-bar dinámicamente
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.isBrowser) {
      const scrollTop = window.scrollY; // Obtiene el valor de scroll vertical
      const maxScroll = 200; // Máximo scroll para alcanzar opacidad total
      this.scrollOpacity = Math.min(scrollTop / maxScroll, 0.8); // Limita opacidad máxima a 0.4
    }
  }

  // Función que se activa al hacer clic en el logo
  irAlInicio() {
    // Cierra el menú si está abierto (útil en móvil)
    this.menuOpen = false;

    const currentUrl = this.router.url;

    if (currentUrl === '/' || currentUrl === '/inicio') {
      // Si ya estás en inicio, hace scroll suave hacia el top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Si estás en otra ruta, navega hacia la raíz
      this.router.navigate(['/']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  irRegistro() {
    this.menuOpen = false;
    this.router.navigate(['/registroClientes']);
  }

  irAbout() {
    this.menuOpen = false;
    this.router.navigate(['/about']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  irLogin() {
    this.menuOpen = false;
    this.router.navigate(['/login']);
  }
}
