import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FondoAnimadoComponent } from '../../../shared/fondo-animado/fondo-animado.component';

interface Objetivo {
  titulo: string;
  descripcion: string;
  icono: string;
  color: string;
}

@Component({
  selector: 'app-about',
  imports: [FondoAnimadoComponent, CommonModule],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit {
  objetivoActual: number = 0;
  objetivos: Objetivo[] = [];
  isBrowser: boolean;

  // Constructor con inyecciones necesarias
  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.objetivos = [
      {
        titulo: 'Optimización',
        descripcion:
          'Automatizar y mejorar los procesos de almacenamiento para aumentar la eficiencia operativa.',
        icono:
          'M12 2a10 10 0 0 0-7.07 17.07A10 10 0 0 0 17.07 4.93 9.93 9.93 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-13h2v6h-2zm0 8h2v2h-2z',
        color: '#4CAF50',
      },
      {
        titulo: 'Seguridad',
        descripcion:
          'Garantizar la protección de la información y los productos con tecnología de vanguardia.',
        icono:
          'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zM12 21c-4.42-1.16-8-5.77-8-10V6.3l8-3.58 8 3.58V11c0 4.23-3.01 8.43-8 10z M11 14h2v2h-2zm0-8h2v6h-2z',
        color: '#536DFE',
      },
      {
        titulo: 'Accesibilidad',
        descripcion: 'Permitir la gestión remota desde cualquier lugar con acceso a internet.',
        icono:
          'M12 2a2 2 0 100 4 2 2 0 000-4zM21 6h-6.31a6.956 6.956 0 00-5.38 0H3v2h6.03l-1.34 4H5v2h3.03l-2 6h2.13l2-6h3.68l2 6h2.13l-2-6H19v-2h-2.69l-1.34-4H21V6z',
        color: '#29B6F6',
      },
      {
        titulo: 'Satisfacción',
        descripcion:
          'Superar las expectativas del cliente con soluciones ágiles, efectivas y personalizadas.',
        icono:
          'M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm0 22C6.488 22 2 17.512 2 12S6.488 2 12 2s10 4.488 10 10-4.488 10-10 10zm0-5c-2.688 0-5-1.781-5-4h2c0 1.113 1.35 2 3 2s3-.887 3-2h2c0 2.219-2.313 4-5 4z',
        color: '#FFB300',
      },
    ];
  }

  actualizarIndice(event: Event): void {
    const element = event.target as HTMLElement;
    const scrollLeft = element.scrollLeft; // hcuánto se desplazó
    const itemWidth = element.clientWidth; // ancho visible
    const newIndex = Math.round(scrollLeft / itemWidth); // redondea a la tarjeta más cercana
    this.objetivoActual = newIndex;
  }

  // Verificar si un indicador está activo
  esActivo(index: number): boolean {
    return index === this.objetivoActual;
  }
}
