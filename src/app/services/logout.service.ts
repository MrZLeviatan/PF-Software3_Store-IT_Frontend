// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../components/toast/service/toast.service';

@Injectable({
  providedIn: 'root',
})
// cierra sesión, limpia token y redirige al login.
export class LogoutService {
  constructor(private router: Router, private toastr: ToastService) {}

  logout(): void {
    // Limpiar sesión o token
    localStorage.clear(); // También puedes eliminar cookies si aplica
    localStorage.removeItem('token'); // O 'authToken' si usas otro nombre

    // Redirigir al login
    this.router.navigate(['/'], { replaceUrl: true }); // o '/' según prefieras
    this.toastr.show('Cierre de sesión exitoso.', 'error');
  }
}
