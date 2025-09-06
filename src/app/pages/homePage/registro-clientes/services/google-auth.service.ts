import { ClienteService } from './../../../../services/homePage/registroCliente.service';
import { Injectable } from '@angular/core';
import { GoogleValidateResponse } from '../../../../dto/common/google-validation.dto';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private clientId = '79690855058-fojmhksrcau0tbvjlvfd10sifun3ght9.apps.googleusercontent.com'; // 🔹 cambia por el tuyo

  constructor(private clienteService: ClienteService) {}

  /**
   * Inicializa el botón oficial de Google en el div dado por ID
   */
  initGoogleButton(elementId: string, callback: (payload: GoogleValidateResponse) => void): void {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => this.handleCredentialResponse(response, callback),
    });

    google.accounts.id.renderButton(document.getElementById(elementId), {
      theme: 'outline',
      size: 'large',
      text: 'signup_with',
    });
  }

  /**
   * Maneja la respuesta de Google: obtiene idToken, lo envía al backend y devuelve payload
   */
  private handleCredentialResponse(
    response: any,
    callback: (payload: GoogleValidateResponse) => void
  ) {
    const idToken = response?.credential;
    if (!idToken) return;

    this.validarTokenGoogle(idToken).subscribe({
      next: (payload) => callback(payload),
      error: (err) => console.error('Error validando token Google:', err),
    });
  }

  /**
   * Valida el idToken con backend para obtener name/email
   */
  validarTokenGoogle(idToken: string): Observable<GoogleValidateResponse> {
    return this.clienteService.validarTokenGoogle(idToken).pipe(
      tap((res: any) => console.log('Google payload validado:', res)),
      map((res: any) => res.mensaje)
    );
    // Extrae solo el mensaje para el componente
  }
}
