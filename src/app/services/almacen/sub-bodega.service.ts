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
export class SuBodegaService {
  // URL base del servicio
  private baseUrl = `${API_CONFIG.baseUrl}/api/sub-bodega`; // URL del backend
}
