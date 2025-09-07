import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarruselService {
  private servicios = [
    {
      titulo: 'Almacenamiento',
      imagen:
        'https://res.cloudinary.com/dehltwwbu/image/upload/f_auto,q_auto/v1756987006/gestionBodegas_i5bhkl.jpg',
      descripcion:
        'Descubre una nueva forma de almacenar: segura, ordenada y 100% controlada. Visualiza en tiempo real cómo se ' +
        'utiliza cada espacio y toma decisiones rápidas para optimizar tu operación. Almacenar nunca fue tan fácil, inteligente y ' +
        'confiable.',
    },
    {
      titulo: 'Facturación Automatizada',
      imagen:
        'https://res.cloudinary.com/dehltwwbu/image/upload/f_auto,q_auto/v1756987368/facturacion_nzbxoo.jpg',
      descripcion:
        'Haz que cada metro cuadrado trabaje para ti. Con nuestra solución avanzada, no solo almacenas productos de forma ' +
        'segura, sino que también generas facturas automáticas según el uso real de tus espacios. Sin más cálculos manuales ni sorpresas, ' +
        'todo se gestiona de manera eficiente, precisa y transparente para que tu negocio siga creciendo sin complicaciones.',
    },
    {
      titulo: 'Seguimiento en tiempo real',
      imagen:
        'https://res.cloudinary.com/dehltwwbu/image/upload/f_auto,q_auto/v1756987437/seguimiento_sfvi71.jpg',
      descripcion:
        '"La gestión eficiente comienza con el control en tiempo real. Monitorea los movimientos de productos y la ' +
        'disponibilidad de tus espacios al instante, sin complicaciones. Con nuestra plataforma, tienes acceso inmediato a toda la ' +
        'información que necesitas para mejorar la logística, reducir tiempos de espera y mantener tu inventario siempre a la vanguardia.',
    },
  ];

  // Devuelve todos los servicios
  getServicios() {
    return this.servicios;
  }
}
