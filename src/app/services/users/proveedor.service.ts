import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../app.config';

// Dtos
import { MensajeDto } from '../../dto/common/mensajeDto.dto';
import { ProveedorDto } from '../../dto/users/proveedor.dto';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  // URL base del servicio
  private baseUrl = `${API_CONFIG.baseUrl}/api/proveedor`; // URL del backend

  constructor(private http: HttpClient) {}

  // Obtener la lista completa de proveedores
  listarProveedores(): Observable<MensajeDto<ProveedorDto[]>> {
    return this.http.get<MensajeDto<ProveedorDto[]>>(`${this.baseUrl}/listar`);
  }

  // Obtener un proveedor específico por su ID
  obtenerProveedorPorId(idProveedor: number): Observable<MensajeDto<ProveedorDto>> {
    return this.http.get<MensajeDto<ProveedorDto>>(`${this.baseUrl}/${idProveedor}`);
  }
}
