import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CarritoCompraDto } from '../../dto/objects/compra/carrito-compra/carrito-compra.dto';
import { API_CONFIG } from '../../app.config';

@Injectable({
  providedIn: 'root',
})
export class CompraService {
  private baseUrl = `${API_CONFIG.baseUrl}/api/compra`;

  constructor(private http: HttpClient) {}

  // Crear sesión de pago con Stripe
  crearSesionPago(carrito: CarritoCompraDto): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.baseUrl}/crear-sesion-pago`, carrito);
  }
}
