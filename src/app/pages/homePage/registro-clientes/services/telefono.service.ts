import { Injectable } from '@angular/core';
import intlTelInput from 'intl-tel-input';

@Injectable({ providedIn: 'root' })
export class TelefonoService {
  private itiInstances: Map<string, any> = new Map(); // <-- usamos 'any'

  inicializar(inputId: string) {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (!input) return;

    const iti = intlTelInput(input, {
      initialCountry: 'co',
      preferredCountries: ['co', 'us', 'gb', 'ca', 'mx', 'fr'],
      separateDialCode: true,
    } as any);
    this.itiInstances.set(inputId, iti);
  }

  obtenerNumero(inputId: string): string | null {
    const iti = this.itiInstances.get(inputId);
    if (!iti) return null;

    const raw = (document.getElementById(inputId) as HTMLInputElement)?.value || '';
    const codigo = iti.getSelectedCountryData().dialCode;
    return raw ? `+${codigo}${raw}` : null;
  }

  obtenerCodigoPais(inputId: string): string | null {
    const iti = this.itiInstances.get(inputId);
    return iti ? iti.getSelectedCountryData().dialCode : null;
  }
}
