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
                ciudad: data.address?.city || data.address?.town || 'Desconocida',
                latitud: lat,
                longitud: lon,
              };
              resolve(ubicacion);
            } catch (error) {
              reject('No se pudo resolver la ubicación exacta: ' + error);
            }
          },
          (err) => {
            // Manejo detallado de errores
            switch (err.code) {
              case err.PERMISSION_DENIED:
                reject('Permiso denegado para acceder a la ubicación.');
                break;
              case err.POSITION_UNAVAILABLE:
                reject('Ubicación no disponible.');
                break;
              case err.TIMEOUT:
                reject('Tiempo de espera agotado al obtener la ubicación.');
                break;
              default:
                reject('Error desconocido al obtener la ubicación: ' + err.message);
            }
          },
          {
            enableHighAccuracy: true, // Mejor precisión en móviles
            timeout: 10000, // 10 segundos de espera
            maximumAge: 0, // No usar caché
          }
        );
      } else {
        reject('Geolocalización no soportada en este navegador.');
      }
    });
  }
}
