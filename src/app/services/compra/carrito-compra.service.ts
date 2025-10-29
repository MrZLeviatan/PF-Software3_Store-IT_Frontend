import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroItemCompraDto } from '../../dto/objects/compra/carrito-compra/registro-items-carrito.dto';
import { ModificarCantidadItemsDto } from '../../dto/objects/compra/carrito-compra/modificar-cantidad-items.dto';
import { EliminarItemsCarritoDto } from '../../dto/objects/compra/carrito-compra/eliminar-items-carrito.dto';
import { MensajeDto } from '../../dto/common/mensajeDto.dto';
import { CarritoCompraDto } from '../../dto/objects/compra/carrito-compra/carrito-compra.dto';
import { API_CONFIG } from '../../app.config';

@Injectable({
  providedIn: 'root',
})
export class CarritoCompraService {
  private baseUrl = `${API_CONFIG.baseUrl}/api/carrito-compra`;

  constructor(private http: HttpClient) {}

  agregarProducto(item: RegistroItemCompraDto): Observable<MensajeDto<string>> {
    return this.http.post<MensajeDto<string>>(`${this.baseUrl}/agregar`, item);
  }

  modificarCantidad(item: ModificarCantidadItemsDto): Observable<MensajeDto<string>> {
    return this.http.post<MensajeDto<string>>(`${this.baseUrl}/modificar-cantidad`, item);
  }

  eliminarProducto(item: EliminarItemsCarritoDto): Observable<MensajeDto<string>> {
    return this.http.post<MensajeDto<string>>(`${this.baseUrl}/eliminar`, item);
  }

  obtenerCarritoCliente(idCliente: number): Observable<MensajeDto<CarritoCompraDto>> {
    return this.http.get<MensajeDto<CarritoCompraDto>>(`${this.baseUrl}/cliente/${idCliente}`);
  }
}
