import { RegistroEspacioProductoDto } from './../../dto/objects/almacen/espacioProducto/registro-espacio-producto.dto';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../app.config';
// Dtos
import { MensajeDto } from '../../dto/common/mensajeDto.dto';
import { EspacioProductoDto } from '../../dto/objects/almacen/espacioProducto/espacio-producto.dto';

@Injectable({
  providedIn: 'root',
})
export class EspacioProductoService {
  // URL base del servicio
  private baseUrl = `${API_CONFIG.baseUrl}/api/espacio-producto`; // URL del backend

  constructor(private http: HttpClient) {}

  // Registro de un espacio asociado a un producto
  registroEspacioProductoDto(
    espacioProducto: FormData
  ): Observable<MensajeDto<EspacioProductoDto>> {
    return this.http.post<MensajeDto<EspacioProductoDto>>(
      `${this.baseUrl}/registrar`,
      espacioProducto
    );
  }

  // Obtener el espacio ocupado por un producto en el almacén.
  obtenerEspacioOcupadoPorProducto(idProducto: number): Observable<MensajeDto<EspacioProductoDto>> {
    return this.http.get<MensajeDto<EspacioProductoDto>>(`${this.baseUrl}/producto/${idProducto}`);
  }
}
