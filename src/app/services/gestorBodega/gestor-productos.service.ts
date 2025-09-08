import { RegistroNuevoProductoDto } from '../../dto/producto/registro-nuevo-producto.dto';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BodegaDto } from '../../dto/bodega/bodega.dto';
import { MensajeDto } from '../../dto/common/mensajeDto.dto';
import { map } from 'rxjs/operators';
import { ProductoDto } from '../../dto/producto/producto.dto';
import { RegistrarProductoExistenteDto } from '../../dto/producto/registrar-producto-existente.dto';
import { RetiroProductoDto } from '../../dto/producto/retiro-producto.dto';
import { MovimientosProductoDto } from '../../dto/movimiento/movimiento.dto';
import { AutorizacionProductoDto } from '../../dto/movimiento/autorizar-movimiento.dto';
import { API_CONFIG } from '../../app.config';

@Injectable({
  providedIn: 'root',
})
export class GestorBodegasService {
  private baseUrl = `${API_CONFIG.baseUrl}/api/gestor-bodega`;

  constructor(private http: HttpClient) {}

  // Listar productos con filtros y paginación
  listarProductos(paramsObj?: {
    codigoProducto?: string;
    tipoProducto?: string;
    estadoProducto?: string;
    idBodega?: string;
    pagina?: number;
    size?: number;
  }): Observable<ProductoDto[]> {
    let params = new HttpParams();
    if (paramsObj) {
      Object.keys(paramsObj).forEach((k) => {
        const v: any = (paramsObj as any)[k];
        if (v !== undefined && v !== null && v !== '') {
          params = params.set(k, String(v));
        }
      });
    }
    return this.http
      .get<MensajeDto<ProductoDto[]>>(`${this.baseUrl}/productos`, { params })
      .pipe(map((res) => res.mensaje));
  }

  // Ver detalle
  verDetalleProducto(codigoProducto: string): Observable<ProductoDto> {
    return this.http
      .get<MensajeDto<ProductoDto>>(
        `${this.baseUrl}/productos/${encodeURIComponent(codigoProducto)}`
      )
      .pipe(map((res) => res.mensaje));
  }

  // ============================
  // Movimientos
  // ============================

  // Autorizar movimiento de producto
  autorizarMovimiento(dto: AutorizacionProductoDto): Observable<string> {
    return this.http
      .post<MensajeDto<string>>(`${this.baseUrl}/movimientos/autorizar`, dto)
      .pipe(map((res) => res.mensaje));
  }

  // Ver detalle de un movimiento
  verDetallesMovimiento(idMovimiento: number): Observable<MovimientosProductoDto> {
    return this.http
      .get<MensajeDto<MovimientosProductoDto>>(`${this.baseUrl}/movimientos/${idMovimiento}`)
      .pipe(map((res) => res.mensaje));
  }

  // Obtener lista de movimientos de un producto específico
  obtenerMovimientosProductoEspecifico(
    codigoProducto: string
  ): Observable<MovimientosProductoDto[]> {
    return this.http
      .get<MensajeDto<MovimientosProductoDto[]>>(
        `${this.baseUrl}/movimientos/producto/${encodeURIComponent(codigoProducto)}`
      )
      .pipe(map((res) => res.mensaje));
  }

  // Obtener lista de movimientos con filtros y paginación
  obtenerMovimientosProducto(paramsObj?: {
    codigoProducto?: string;
    tipoMovimiento?: string;
    fechaMovimiento?: string;
    emailPersonalResponsable?: string;
    emailPersonalAutorizado?: string;
    idBodega?: string;
    pagina?: number;
    size?: number;
  }): Observable<MovimientosProductoDto[]> {
    let params = new HttpParams();
    if (paramsObj) {
      Object.keys(paramsObj).forEach((k) => {
        const v: any = (paramsObj as any)[k];
        if (v !== undefined && v !== null && v !== '') {
          params = params.set(k, String(v));
        }
      });
    }
    return this.http
      .get<MensajeDto<MovimientosProductoDto[]>>(`${this.baseUrl}/movimientos`, { params })
      .pipe(map((res) => res.mensaje));
  }
}
