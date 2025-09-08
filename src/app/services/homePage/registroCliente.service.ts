import { GoogleValidateResponse } from './../../dto/common/google-validation.dto';
import { CrearClienteDto } from './../../dto/homePage/registro/crear-cliente.dto';
import { CodigoVerificacionDto } from '../../dto/common/codigo-verificacion.dto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearClienteGoogleDto } from '../../dto/homePage/registro/crear-cliente-google.dto';
import { API_CONFIG } from '../../app.config';

@Injectable({
  providedIn: 'root',
})
export class RegistroClienteService {
  private baseUrl = `${API_CONFIG.baseUrl}/api/store-it`; // Endpoint de Spring Boot

  constructor(private http: HttpClient) {}

  registrarCliente(cliente: CrearClienteDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/registro-clientes`, cliente);
  }

  verificarRegistroCliente(codigo: CodigoVerificacionDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/verificar-registro-clientes`, codigo);
  }

  // Envia idToken al backend para verificar y obtener name/email
  validarTokenGoogle(idToken: string): Observable<GoogleValidateResponse> {
    return this.http.post<GoogleValidateResponse>(`${this.baseUrl}/validate-google`, {
      idToken,
    });
  }

  // Registrar cliente final usando el DTO esperado por tu backend
  registrarClienteGoogle(crearClienteGoogleDto: CrearClienteGoogleDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/registro-clientes-google`, crearClienteGoogleDto);
  }
}
