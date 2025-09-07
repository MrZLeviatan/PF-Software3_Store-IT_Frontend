import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FondoAnimadoComponent } from '../../../shared/fondo-animado/fondo-animado.component';
import { CarruselService } from './service/carrusel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FondoAnimadoComponent, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  isBrowser: boolean;
  scrollOpacity: number = 0;
  servicios: any[] = [];
  contenidoActual = 0;
  menuOpen: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private carruselService: CarruselService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Se ejecuta al iniciar el componente
  ngOnInit(): void {
    if (this.isBrowser) {
      this.servicios = this.carruselService.getServicios();
      setInterval(() => this.cambiarContenido(1), 15000);
    }
  }

  // Cambia el contenido mostrado del carrusel
  cambiarContenido(direccion: number): void {
    this.contenidoActual += direccion;
    if (this.contenidoActual < 0) {
      this.contenidoActual = this.servicios.length - 1;
    } else if (this.contenidoActual >= this.servicios.length) {
      this.contenidoActual = 0;
    }
  }

  // Actualiza el índice del carrusel según el scroll
  actualizarIndice(event: Event): void {
    const element = event.target as HTMLElement;
    const scrollLeft = element.scrollLeft;
    const itemWidth = element.clientWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);
    this.contenidoActual = newIndex;
  }

  // Navega a la sección de contacto
  irAContacto() {
    this.router.navigate(['/contacto']);
  }
}
