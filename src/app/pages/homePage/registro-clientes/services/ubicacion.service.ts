import { Injectable } from '@angular/core';
import { UbicacionDto } from '../../../../dto/common/ubicacion.dto';

@Injectable({
  providedIn: 'root',
})
export class UbicacionService {
  private MAPBOX_TOKEN =
    'pk.eyJ1Ijoibmljb2xhczI4MTAwMiIsImEiOiJjbWE4Mzl6MnAwNXNlMmxxOHBwcDdkYmNtIn0.WlIhPikCih8koze2XDEiyw'; // 🔹 Reemplaza con tu token

  constructor() {}

  // Obtener ubicación actual usando la API del navegador
  obtenerUbicacionActual(): Promise<UbicacionDto> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocalización no soportada en este navegador.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            // Llamada a Mapbox Reverse Geocoding
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${this.MAPBOX_TOKEN}`;
            const response = await fetch(url);
            const data = await response.json();

            // Mapear la respuesta
            const ciudadFeature = data.features.find((f: any) => f.place_type.includes('place'));
            const paisFeature = data.features.find((f: any) => f.place_type.includes('country'));

            const ubicacion: UbicacionDto = {
              pais: paisFeature?.text || 'Desconocido',
              ciudad: ciudadFeature?.text || 'Desconocida',
              latitud: lat,
              longitud: lon,
            };

            resolve(ubicacion);
          } catch (error) {
            reject('No se pudo resolver la ubicación exacta: ' + error);
          }
        },
        (err) => {
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
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }
}
