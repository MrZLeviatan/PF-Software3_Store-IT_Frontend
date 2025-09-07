import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BodegaDto } from '../../dto/bodega/bodega.dto';
import { MensajeDto } from '../../dto/common/mensajeDto.dto';
import { map } from 'rxjs/operators';
import { RegistroNuevoProductoDto } from '../../dto/personalBodega/auxiliarBodega/registroNuevoProducto.dto';

@Injectable({
  providedIn: 'root',
})
export class AuxiliarBodegaService {
  private baseUrl = 'http://localhost:8080/api/auxiliar-bodega';

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
}
