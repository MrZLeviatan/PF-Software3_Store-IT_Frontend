import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroLoteDto } from '../../dto/objects/inventario/lotes/registro-lotes.dto';
import { MensajeDto } from '../../dto/common/mensajeDto.dto';
import { API_CONFIG } from '../../app.config';

// 🇪🇸 Servicio para manejar operaciones relacionadas con Lotes
// 🇺🇸 Service to handle batch (lote) related operations
@Injectable({
  providedIn: 'root',
})
export class LoteService {
  private baseUrl = `${API_CONFIG.baseUrl}/api/lote`; // URL del backend

  constructor(private http: HttpClient) {}

  registrarLote(dto: RegistroLoteDto): Observable<MensajeDto<string>> {
    return this.http.post<MensajeDto<string>>(`${this.baseUrl}/registrar`, dto);
  }
}
