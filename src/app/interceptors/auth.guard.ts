import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
// Proteger rutas y redirigir si no hay token válido.
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = this.tokenService.getToken();

    if (!token) {
      console.warn('❌ Token ausente. Redirigiendo a inicio.');
      return this.router.createUrlTree(['/']);
    }

    const decoded: any = this.tokenService.decodeToken(token);
    const ahora = Math.floor(Date.now() / 1000);

    if (!decoded || !decoded.exp || decoded.exp <= ahora) {
      console.warn('❌ Token inválido o expirado. Redirigiendo a inicio.');
      return this.router.createUrlTree(['/']);
    }

    return true;
  }
}
