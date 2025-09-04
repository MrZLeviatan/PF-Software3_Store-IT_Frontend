import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TelefonoService {
  constructor() {}

  // Obtener número completo con código de país
  obtenerNumero(inputId: string): string | null {
    const input = document.querySelector<HTMLInputElement>(`#${inputId}`);
    if (!input) return null;

    // @ts-ignore -> porque intlTelInput agrega la función al input
    return input?.intlTelInput('getNumber') || null;
  }

  // Obtener solo el código de país
  obtenerCodigoPais(inputId: string): string | null {
    const input = document.querySelector<HTMLInputElement>(`#${inputId}`);
    if (!input) return null;

    // @ts-ignore
    const data = input?.intlTelInput('getSelectedCountryData');
    return data?.dialCode || null;
  }
}
