import { Injectable } from '@angular/core';
import { UbicacionDto } from '../../../../dto/common/ubicacion.dto';

@Injectable({
  providedIn: 'root',
})
export class UbicacionService {
  constructor() {}

  // Obtener ubicación actual usando la API del navegador
  obtenerUbicacionActual(): Promise<UbicacionDto> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const lat = pos.coords.latitude;
              const lon = pos.coords.longitude;

              // Llamada a Nominatim (reverse geocoding)
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
              );
              const data = await response.json();

              const ubicacion: UbicacionDto = {
                pais: data.address?.country || 'Desconocido',
                ciudad: data.address?.city || 'Desconocida',
                latitud: pos.coords.latitude,
                longitud: pos.coords.longitude,
              };
              resolve(ubicacion);
            } catch (error) {
              reject('No se pudo resolver la ubicación exacta: ' + error);
            }
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
