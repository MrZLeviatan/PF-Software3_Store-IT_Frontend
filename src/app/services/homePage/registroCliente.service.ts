import { CrearClienteDto } from './../../dto/homePage/registro/crear-cliente.dto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private baseUrl = 'http://localhost:8080/api/store-it'; // Endpoint de Spring Boot

  constructor(private http: HttpClient) {}

  registrarCliente(cliente: CrearClienteDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/registro-clientes`, cliente);
  }
}
