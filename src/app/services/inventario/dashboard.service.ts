import { ResumenDashboardDto } from './../../dto/objects/inventario/producto/resumen-dashboard.dto';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../app.config';
// Enums
// Dtos
import { MensajeDto } from '../../dto/common/mensajeDto.dto';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  // URL base del servicio
  private baseUrl = `${API_CONFIG.baseUrl}/api/dashboard`; // URL del backend

  constructor(private http: HttpClient) {}

  // Obtener el Dashboard de los productos.
  obtenerResumenProductos(): Observable<MensajeDto<ResumenDashboardDto>> {
    return this.http.get<MensajeDto<ResumenDashboardDto>>(`${this.baseUrl}/productos`);
  }
}
