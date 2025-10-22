import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../app.config';
// Enums
import { TipoProducto } from '../../dto/enum/tipo-producto';
// Dtos
import { MensajeDto } from '../../dto/common/mensajeDto.dto';
import { ProductoDto } from '../../dto/objects/inventario/producto/producto.dto';
import { RegistroProductoDto } from '../../dto/objects/inventario/producto/registro-producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  // URL base del servicio
  private baseUrl = `${API_CONFIG.baseUrl}/api/producto`; // URL del backend

  constructor(private http: HttpClient) {}

  // Registrar un nuevo producto.
  registrarProducto(producto: FormData): Observable<MensajeDto<ProductoDto>> {
    return this.http.post<MensajeDto<ProductoDto>>(`${this.baseUrl}/registrar`, producto);
  }

  // Obtener todos los productos disponibles.
  listarProductos(): Observable<MensajeDto<ProductoDto[]>> {
    return this.http.get<MensajeDto<ProductoDto[]>>(`${this.baseUrl}/listar`);
  }

  // Obtener productos filtrados por tipo de producto o proveedor (con paginación).
  filtrarProductos(
    tipoProducto?: TipoProducto,
    idProveedor?: string,
    pagina: number = 0,
    size: number = 10
  ): Observable<MensajeDto<ProductoDto[]>> {
    let params = new HttpParams().set('pagina', pagina).set('size', size);

    // Solo agrega los filtros si existen
    if (tipoProducto) params = params.set('tipoProducto', tipoProducto);
    if (idProveedor) params = params.set('idProveedor', idProveedor);

    return this.http.get<MensajeDto<ProductoDto[]>>(`${this.baseUrl}/listar/filtro`, { params });
  }

  // Obtener un producto por su ID.
  obtenerProductoPorId(idProducto: number): Observable<MensajeDto<ProductoDto>> {
    return this.http.get<MensajeDto<ProductoDto>>(`${this.baseUrl}/obtener/${idProducto}`);
  }
}
