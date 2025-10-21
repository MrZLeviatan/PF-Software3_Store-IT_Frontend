// validar-login.service.ts
import { Injectable } from '@angular/core';
import { TokenService } from '../../../../services/token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
// Redirigir al usuario según el rol y expiración del token.
export class ValidarLoginService {
  constructor(private tokenService: TokenService, private router: Router) {}

  /**
   * Redirige al usuario según el rol contenido en el token
   * Si el token no existe o está expirado, redirige al inicio
   */
  redirigirSegunRol(): void {
    const token = this.tokenService.getToken();

    if (!token) {
      this.router.navigate(['/']);
      return;
    }

    const decoded: any = this.tokenService.decodeToken(token); // usamos método de TokenService

    if (!decoded || !decoded.rol || !decoded.exp) {
      this.router.navigate(['/']);
      return;
    }

    // Validar expiración
    const ahora = Math.floor(Date.now() / 1000);
    if (decoded.exp <= ahora) {
      this.router.navigate(['/']);
      return;
    }

    // Guardar rol en el localStorage
    localStorage.setItem('rolUsuario', decoded.rol);

    // Redirigir según rol
    switch (decoded.rol) {
      case 'ROLE_CLIENTE':
        this.router.navigate(['/cliente']);
        break;

      case 'ROLE_GESTOR_COMERCIAL':
        this.router.navigate(['/gestor-comercial']);
        break;

      case 'ROLE_AUXILIAR_BODEGA':
        this.router.navigate(['/auxiliar-bodega']);
        break;
      case 'ROLE_GESTOR_BODEGA':
        this.router.navigate(['/gestor-bodega']);
        break;
      case 'ROLE_RECURSOS_HUMANOS':
        this.router.navigate(['/recursos-humanos/dashboard']);
        break;
      case 'ROLE_PERSONAL_BODEGA':
        this.router.navigate(['/bodega/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
