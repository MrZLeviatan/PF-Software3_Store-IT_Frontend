import { Injectable } from '@angular/core';
import { UbicacionDto } from '../../../../dto/common/ubicacion.dto';

@Injectable({
  providedIn: 'root',
})
export class UbicacionService {
  constructor() {}

  // 📍 Obtener ubicación actual usando la API del navegador
  obtenerUbicacionActual(): Promise<UbicacionDto> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const ubicacion: UbicacionDto = {
              pais: 'Desconocido', // se puede mejorar con reverse geocoding
              ciudad: 'Desconocida',
              latitud: pos.coords.latitude,
              longitud: pos.coords.longitude,
            };
            resolve(ubicacion);
          },
          (err) => {
            reject('No se pudo obtener la ubicación: ' + err.message);
          }
        );
      } else {
        reject('Geolocalización no soportada en este navegador.');
      }
    });
  }
}
