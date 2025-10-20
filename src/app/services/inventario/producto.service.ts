import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { MensajeDto } from '../../dto/common/mensajeDto.dto';
import { ProductoDto } from '../../dto/objects/inventario/producto/producto.dto';
import { API_CONFIG } from '../../app.config';
import { TipoProducto } from '../../dto/enum/tipo-producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private baseUrl = `${API_CONFIG.baseUrl}/api/producto`; // URL del backend

  constructor(private http: HttpClient) {}

  listarProductos(): Observable<MensajeDto<ProductoDto[]>> {
    return this.http.get<MensajeDto<ProductoDto[]>>(`${this.baseUrl}/listar`).pipe(
      tap((res) => console.log('✅ Productos recibidos:', res)),
      catchError((err) => {
        console.error('❌ Error al cargar productos:', err);
        return throwError(() => err);
      })
    );
  }

  listarProductosPorTipo(tipoProducto: TipoProducto): Observable<MensajeDto<ProductoDto[]>> {
    return this.http.get<MensajeDto<ProductoDto[]>>(`${this.baseUrl}/listar/${tipoProducto}`);
  }
}
