import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BodegaDto } from '../../dto/bodega/bodega.dto';
import { MensajeDto } from '../../dto/common/mensajeDto.dto';
import { map } from 'rxjs/operators';

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
}
