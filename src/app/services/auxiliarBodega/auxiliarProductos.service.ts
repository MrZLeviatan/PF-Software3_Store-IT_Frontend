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
import { API_CONFIG } from '../../app.config';

@Injectable({
  providedIn: 'root',
})
export class AuxiliarBodegaService {
  private baseUrl = `${API_CONFIG.baseUrl}/api/auxiliar-bodega`;

  constructor(private http: HttpClient) {}

  // Obtener todas las bodegas
  listarBodegas(): Observable<BodegaDto[]> {
    return this.http
      .get<MensajeDto<BodegaDto[]>>(`${this.baseUrl}/bodegas`)
      .pipe(map((res) => res.mensaje));
  }

  // Registrar nuevo producto
  registrarProducto(dto: RegistroNuevoProductoDto): Observable<any> {
    const formData = new FormData();

    // Agregar todos los campos
    formData.append('codigoProducto', dto.codigoProducto);
    formData.append('nombre', dto.nombre);
    formData.append('cantidad', dto.cantidad.toString());
    formData.append('descripcion', dto.descripcion);
    formData.append('tipoProducto', dto.tipoProducto);
    formData.append('idBodega', dto.idBodega);
    formData.append('emailPersonalBodega', dto.emailPersonalBodega);
    if (dto.descripcionMovimiento) {
      formData.append('descripcionMovimiento', dto.descripcionMovimiento);
    }

    // Agregar imagen
    if (dto.imagenProducto) {
      formData.append('imagenProducto', dto.imagenProducto, dto.imagenProducto.name);
    }

    return this.http.post(`${this.baseUrl}/productos`, formData);
  }

  /* Sección Ver PRODUCTOS  */

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

  // Agregar cantidad a producto existente
  agregarCantidadProducto(dto: RegistrarProductoExistenteDto) {
    return this.http.post<MensajeDto<string>>(`${this.baseUrl}/productos/stock`, dto);
  }

  // Retiro
  retiroProducto(dto: RetiroProductoDto) {
    return this.http.post<MensajeDto<string>>(`${this.baseUrl}/productos/retiro`, dto);
  }
}
